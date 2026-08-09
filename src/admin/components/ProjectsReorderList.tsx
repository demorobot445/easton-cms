import React, { useEffect, useState } from "react";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useConfig } from "payload/components/utilities";
import { DefaultTemplate } from "payload/components/templates";

type Project = { id: string; name: string; order: number };

const Row: React.FC<{ project: Project }> = ({ project }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: project.id });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        padding: "10px 16px",
        marginBottom: 6,
        background: "var(--theme-elevation-50)",
        border: "1px solid var(--theme-elevation-150)",
        borderRadius: 4,
        cursor: "grab",
      }}
    >
      {project.name}
    </div>
  );
};

const ProjectsReorderList: React.FC = () => {
  const { serverURL, routes } = useConfig();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${serverURL}${routes.api}/projects?sort=order&limit=1000&depth=0`,
          {
            credentials: "include",
          },
        );

        const data = await res.json();
        setProjects(data.docs);
      } catch (err) {
        console.error("Failed to load projects:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, [serverURL, routes.api]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = projects.findIndex((p) => p.id === active.id);
    const newIndex = projects.findIndex((p) => p.id === over.id);

    const reordered = arrayMove(projects, oldIndex, newIndex);
    setProjects(reordered);

    try {
      setSaving(true);

      await fetch(`${serverURL}${routes.api}/projects/reorder`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderedIds: reordered.map((p) => p.id),
        }),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <DefaultTemplate>
      <div
        style={{
          maxWidth: 600,
          margin: "40px auto",
          paddingInline: "var(--gutter-h)",
        }}
      >
        <h1>Reorder Projects {saving && "(saving...)"}</h1>

        {loading ? (
          <div
            style={{
              padding: "2rem",
              textAlign: "center",
              color: "var(--theme-text)",
            }}
          >
            Loading projects...
          </div>
        ) : (
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={projects.map((p) => p.id)}
              strategy={verticalListSortingStrategy}
            >
              {projects.map((p) => (
                <Row key={p.id} project={p} />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>
    </DefaultTemplate>
  );
};

export default ProjectsReorderList;
