import { motion } from "framer-motion";
import { 
  Rocket, 
  Code2, 
  Palette, 
  Megaphone, 
  Briefcase, 
  Search,
  ArrowRight,
  Plus
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { UseTemplateDialog } from "@/components/project/use-template-dialog";

const templates = [
  {
    title: "Software Development",
    description: "Agile framework with Sprints, Backlog, and Bug Tracking.",
    icon: Code2,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    tags: ["Agile", "Sprint", "Tech"],
    initialTasks: [
      { title: "Project Setup & Base Architecture", status: "To Do", priority: "High" },
      { title: "Requirement Gathering & User Stories", status: "To Do", priority: "Medium" },
      { title: "Define Tech Stack & Database Schema", status: "To Do", priority: "High" },
      { title: "Initial Sprint Planning", status: "To Do", priority: "Medium" }
    ]
  },
  {
    title: "Marketing Campaign",
    description: "Plan content, track social media reach, and manage assets.",
    icon: Megaphone,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    tags: ["Growth", "Social", "Brand"],
    initialTasks: [
      { title: "Define Campaign Goals & KPIs", status: "To Do", priority: "High" },
      { title: "Market Research & Audience Analysis", status: "To Do", priority: "Medium" },
      { title: "Content Calendar Creation", status: "To Do", priority: "Medium" },
      { title: "Social Media Asset Design", status: "To Do", priority: "Low" }
    ]
  },
  {
    title: "Design System",
    description: "Collaborative design workflow from research to delivery.",
    icon: Palette,
    color: "text-pink-500",
    bg: "bg-pink-500/10",
    tags: ["UI/UX", "System", "Brand"],
    initialTasks: [
      { title: "Audit Existing UI Components", status: "To Do", priority: "High" },
      { title: "Define Color Palette & Typography", status: "To Do", priority: "High" },
      { title: "Design Component Library in Figma", status: "To Do", priority: "Medium" },
      { title: "Documentation & Usage Guidelines", status: "To Do", priority: "Medium" }
    ]
  },
  {
    title: "Product Launch",
    description: "Step-by-step roadmap for taking your product to market.",
    icon: Rocket,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    tags: ["Launch", "Scale", "Product"],
    initialTasks: [
      { title: "Final Product QA & Testing", status: "To Do", priority: "High" },
      { title: "Prepare Press Release & Media Kit", status: "To Do", priority: "Medium" },
      { title: "Landing Page Optimization", status: "To Do", priority: "High" },
      { title: "Launch Event Coordination", status: "To Do", priority: "Low" }
    ]
  },
  {
    title: "Business Strategy",
    description: "High-level goal setting and quarterly planning.",
    icon: Briefcase,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    tags: ["Strategy", "Goals", "Business"],
    initialTasks: [
      { title: "SWOT Analysis & Market Positioning", status: "To Do", priority: "High" },
      { title: "Define Quarterly OKRs", status: "To Do", priority: "High" },
      { title: "Resource Allocation & Budgeting", status: "To Do", priority: "Medium" },
      { title: "Quarterly Review Schedule", status: "To Do", priority: "Medium" }
    ]
  }
];

const ExploreTemplates = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleUseTemplate = (template) => {
    setSelectedTemplate(template);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-primary/20 via-primary/5 to-background border border-primary/10 p-12 text-center shadow-2xl">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.15),transparent)] pointer-events-none" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative z-10 max-w-2xl mx-auto space-y-8"
        >
          <Badge className="bg-primary/10 text-primary border-primary/20 px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/5">
            Architecture Lab
          </Badge>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-gradient leading-none">
            Accelerate <br/> your project.
          </h1>
          <p className="text-muted-foreground text-lg font-medium leading-relaxed max-w-xl mx-auto">
            Deploy professionally crafted templates with pre-configured tasks and workflows. Choose your foundation and start building instantly.
          </p>
          
          <div className="flex items-center max-w-md mx-auto glass p-2 rounded-[1.5rem] border-primary/10 shadow-2xl focus-within:ring-2 ring-primary/20 transition-all">
            <Search className="size-5 text-muted-foreground ml-3" />
            <Input 
              placeholder="Search templates..." 
              className="border-none bg-transparent focus-visible:ring-0 text-sm h-12 font-bold"
            />
          </div>
        </motion.div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {templates.map((template, index) => (
          <motion.div
            key={template.title}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -10 }}
            className="group"
          >
            <Card className="h-full glass border-primary/5 transition-all duration-700 group-hover:border-primary/20 group-hover:shadow-[0_48px_80px_-16px_rgba(0,0,0,0.2)] cursor-pointer rounded-[2.5rem] overflow-hidden">
              <CardHeader className="p-10 pb-6">
                <div className={`size-16 rounded-[1.5rem] ${template.bg} flex items-center justify-center ${template.color} mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
                  <template.icon className="size-8" />
                </div>
                <div className="flex gap-2 mb-6">
                  {template.tags.map(tag => (
                    <span key={tag} className="text-[9px] font-black text-muted-foreground uppercase tracking-widest px-3 py-1 rounded-full bg-secondary/50 border border-primary/5">
                      {tag}
                    </span>
                  ))}
                </div>
                <CardTitle className="text-2xl font-black tracking-tight mb-3 group-hover:text-primary transition-colors">
                  {template.title}
                </CardTitle>
                <CardDescription className="text-sm font-medium leading-relaxed min-h-[48px]">
                  {template.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="px-10 pb-10 flex items-center justify-between border-t border-primary/5 pt-8">
                <Button 
                  variant="ghost" 
                  onClick={() => handleUseTemplate(template)}
                  className="p-0 h-auto hover:bg-transparent text-primary font-black uppercase tracking-widest text-[10px] gap-2 group/btn"
                >
                  Use Template
                  <Plus className="size-4 group-hover/btn:rotate-90 transition-transform" />
                </Button>
                <div className="size-10 rounded-full bg-primary/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-x-4 group-hover:translate-x-0">
                  <ArrowRight className="size-4 text-primary" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <UseTemplateDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        template={selectedTemplate} 
      />
    </div>
  );
};

export default ExploreTemplates;
