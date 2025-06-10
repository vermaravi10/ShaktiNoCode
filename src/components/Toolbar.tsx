
import React from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Undo, Redo, Smartphone, Monitor, Save, Rocket, Sparkles } from 'lucide-react';

interface ToolbarProps {
  isEditMode: boolean;
  onToggleMode: (checked: boolean) => void;
  isMobileView: boolean;
  onToggleMobileView: () => void;
}

const Toolbar = ({ isEditMode, onToggleMode, isMobileView, onToggleMobileView }: ToolbarProps) => {
  const handleUndo = () => {
    console.log('Undo action');
    // TODO: Implement undo functionality
  };

  const handleRedo = () => {
    console.log('Redo action');
    // TODO: Implement redo functionality
  };

  const handleSave = () => {
    console.log('Save action');
    // TODO: Implement save functionality
  };

  const handleDeploy = () => {
    console.log('Deploy action');
    // TODO: Implement deploy functionality
  };

  const handleAutoCorrect = () => {
    console.log('AI Auto-correct action');
    // TODO: Implement AI auto-correct functionality
  };

  return (
    <div className="flex items-center justify-between w-full px-6 py-3 bg-background border-b border-border">
      {/* Left section - Breadcrumb */}
      <div className="flex items-center space-x-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="text-muted-foreground hover:text-foreground">
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/editor" className="text-muted-foreground hover:text-foreground">
                Editor
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-foreground font-medium">
                My Website
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Center section - Action buttons */}
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleUndo}
          className="flex items-center gap-2"
        >
          <Undo className="h-4 w-4" />
          Undo
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleRedo}
          className="flex items-center gap-2"
        >
          <Redo className="h-4 w-4" />
          Redo
        </Button>

        <div className="h-6 w-px bg-border mx-2" />

        <Button
          variant="outline"
          size="sm"
          onClick={onToggleMobileView}
          className={`flex items-center gap-2 ${isMobileView ? 'bg-accent' : ''}`}
        >
          {isMobileView ? (
            <Smartphone className="h-4 w-4" />
          ) : (
            <Monitor className="h-4 w-4" />
          )}
          {isMobileView ? 'Mobile' : 'Desktop'}
        </Button>

        <div className="h-6 w-px bg-border mx-2" />

        <Button
          variant="outline"
          size="sm"
          onClick={handleAutoCorrect}
          className="flex items-center gap-2 bg-gradient-to-r from-primary/10 to-accent/10 hover:from-primary/20 hover:to-accent/20"
        >
          <Sparkles className="h-4 w-4" />
          AI Auto-correct
        </Button>
      </div>

      {/* Right section - Mode toggle and action buttons */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-foreground">Edit Mode</span>
          <Switch checked={isEditMode} onCheckedChange={onToggleMode} />
        </div>

        <div className="h-6 w-px bg-border" />

        <Button
          variant="outline"
          size="sm"
          onClick={handleSave}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          Save
        </Button>

        <Button
          size="sm"
          onClick={handleDeploy}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90"
        >
          <Rocket className="h-4 w-4" />
          Deploy
        </Button>
      </div>
    </div>
  );
};

export default Toolbar;
