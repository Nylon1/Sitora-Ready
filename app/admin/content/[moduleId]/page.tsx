import ContentEditorWorkspace from '../../../../components/ContentEditorWorkspace';
import { getEditableContentModule } from '../../../../lib/content-editor-data';

export default async function ContentEditorPage({ params }: { params: Promise<{ moduleId: string }> }) {
  const { moduleId } = await params;
  const module = getEditableContentModule(moduleId);

  if (!module) {
    return (
      <main className="desktopApp">
        <section className="practiceShell">
          <div className="heroPanel"><div><span className="eyebrow">Content Library</span><h1>Module not found.</h1></div></div>
        </section>
      </main>
    );
  }

  return <ContentEditorWorkspace module={module} />;
}
