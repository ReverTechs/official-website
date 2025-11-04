"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  ChevronDown, 
  ChevronUp, 
  Save, 
  Plus, 
  Trash2,
  Edit3,
  User as UserIcon,
  FileText,
  AppWindow,
  Mail,
  Upload,
  X,
  File,
  Image as ImageIcon
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface ContentManagerProps {
  homeContent: any;
  aboutContent: any;
  contactContent: any;
  apps: any[];
  profile: any;
}

export function ContentManager({
  homeContent,
  aboutContent,
  contactContent,
  apps,
  profile,
}: ContentManagerProps) {
  const router = useRouter();
  const supabase = createClient();
  
  const [openSections, setOpenSections] = useState({
    profile: true,
    home: false,
    about: false,
    apps: false,
    contact: false,
  });

  // Profile State
  const [profileData, setProfileData] = useState({
    full_name: profile?.full_name || "",
    avatar_url: profile?.avatar_url || "",
  });

  // Home State
  const [homeData, setHomeData] = useState({
    title: homeContent?.title || "",
    subtitle: homeContent?.subtitle || "",
    description: homeContent?.content?.description || "",
  });

  // About State
  const [aboutData, setAboutData] = useState({
    description: aboutContent?.content?.description || "",
    yearsOfExperience: aboutContent?.content?.yearsOfExperience || 0,
    tools: (aboutContent?.content?.tools || []) as Array<{ name: string; icon?: string; category?: string }>,
  });

  // Contact State
  const [contactData, setContactData] = useState({
    email: contactContent?.content?.email || "",
    description: contactContent?.content?.description || "",
  });

  // Apps State
  const [appsData, setAppsData] = useState(apps.map(app => ({
    id: app.id,
    title: app.title,
    description: app.description,
    category: app.category,
    download_link: app.download_link || "",
    image_url: app.image_url || "",
    image_path: app.image_path || "",
    tags: app.tags?.join(", ") || "",
    display_order: app.display_order,
    file_name: app.file_name || "",
    file_size: app.file_size || 0,
    file_type: app.file_type || "",
  })));

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<{ [key: string]: boolean }>({});
  const [uploadingImage, setUploadingImage] = useState<{ [key: string]: boolean }>({});
  const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null);

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev],
    }));
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("users")
        .update(profileData)
        .eq("id", profile?.id);

      if (error) throw error;
      setMessage({ type: "success", text: "Profile updated successfully!" });
      router.refresh();
    } catch (error: any) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setSaving(false);
    }
  };

  const saveHome = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("site_content")
        .update({
          title: homeData.title,
          subtitle: homeData.subtitle,
          content: { description: homeData.description },
        })
        .eq("section_name", "home_hero");

      if (error) throw error;
      setMessage({ type: "success", text: "Home section updated!" });
      router.refresh();
    } catch (error: any) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setSaving(false);
    }
  };

  const saveAbout = async () => {
    setSaving(true);
    try {
      const { data: current } = await supabase
        .from("site_content")
        .select("content")
        .eq("section_name", "about")
        .single();

      const newContent = {
        ...current?.content,
        description: aboutData.description,
        yearsOfExperience: aboutData.yearsOfExperience || undefined,
        tools: aboutData.tools.length > 0 ? aboutData.tools : undefined,
        skills: current?.content?.skills || [],
      };

      const { error } = await supabase
        .from("site_content")
        .update({
          content: newContent,
        })
        .eq("section_name", "about");

      if (error) throw error;
      setMessage({ type: "success", text: "About section updated!" });
      router.refresh();
    } catch (error: any) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setSaving(false);
    }
  };

  const addTool = () => {
    setAboutData(prev => ({
      ...prev,
      tools: [...prev.tools, { name: "", icon: "", category: "" }],
    }));
  };

  const removeTool = (index: number) => {
    setAboutData(prev => ({
      ...prev,
      tools: prev.tools.filter((_, i) => i !== index),
    }));
  };

  const updateTool = (index: number, field: string, value: string) => {
    setAboutData(prev => ({
      ...prev,
      tools: prev.tools.map((tool, i) => 
        i === index ? { ...tool, [field]: value } : tool
      ),
    }));
  };

  const saveContact = async () => {
    setSaving(true);
    try {
      const { data: current } = await supabase
        .from("site_content")
        .select("content")
        .eq("section_name", "contact")
        .single();

      const newContent = {
        ...current?.content,
        email: contactData.email,
        description: contactData.description,
      };

      const { error } = await supabase
        .from("site_content")
        .update({ content: newContent })
        .eq("section_name", "contact");

      if (error) throw error;
      setMessage({ type: "success", text: "Contact section updated!" });
      router.refresh();
    } catch (error: any) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setSaving(false);
    }
  };

  const saveApp = async (app: any) => {
    setSaving(true);
    try {
      const appData: any = {
        title: app.title,
        description: app.description,
        category: app.category,
        tags: app.tags.split(", ").filter((tag: string) => tag.trim()),
      };

      // Only include image_url if it exists and is not empty
      // This prevents schema cache errors when the column might not be recognized
      if (app.image_url && app.image_url.trim()) {
        appData.image_url = app.image_url;
      }

      // Only set download_link if it's provided (either from upload or external)
      if (app.download_link) {
        appData.download_link = app.download_link;
      }

      // Include image_path if it exists (from uploaded image)
      if (app.image_path) {
        appData.image_path = app.image_path;
        // If we have image_path, also set image_url from it if not already set
        if (!appData.image_url && app.image_url) {
          appData.image_url = app.image_url;
        }
      }

      // Include file information if available
      if (app.file_name) {
        // File info is already saved during upload, but we can update other fields
        // Note: file_path, file_name, file_size, file_type are set during upload
        if (app.file_path) appData.file_path = app.file_path;
        if (app.file_name) appData.file_name = app.file_name;
        if (app.file_size) appData.file_size = app.file_size;
        if (app.file_type) appData.file_type = app.file_type;
      }

      if (app.id) {
        const { error } = await supabase
          .from("apps")
          .update(appData)
          .eq("id", app.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("apps").insert([appData]);
        if (error) throw error;
      }
      
      setMessage({ type: "success", text: "App saved successfully!" });
      router.refresh();
    } catch (error: any) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setSaving(false);
    }
  };

  const deleteApp = async (appId: string) => {
    if (!confirm("Are you sure you want to delete this app?")) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from("apps")
        .delete()
        .eq("id", appId);
      
      if (error) throw error;
      setMessage({ type: "success", text: "App deleted successfully!" });
      router.refresh();
    } catch (error: any) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setSaving(false);
    }
  };

  const addNewApp = () => {
    setAppsData([...appsData, {
      id: "",
      title: "",
      description: "",
      category: "",
      download_link: "",
      image_url: "",
      image_path: "",
      tags: "",
      display_order: appsData.length,
      file_name: "",
      file_size: 0,
      file_type: "",
    }]);
  };

  const handleFileUpload = async (appIndex: number, file: File | null) => {
    if (!file) return;

    const app = appsData[appIndex];
    
    // Check if app is saved first
    if (!app.id) {
      setMessage({ 
        type: "error", 
        text: "Please save the app first before uploading a file. Fill in at least the title, description, and category, then click Save." 
      });
      return;
    }
    
    // Validate file type
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    if (!fileExtension || !["apk", "ipa"].includes(fileExtension)) {
      setMessage({ type: "error", text: "Invalid file type. Only .apk and .ipa files are allowed." });
      return;
    }

    // Validate file size (max 500MB)
    const maxSize = 500 * 1024 * 1024;
    if (file.size > maxSize) {
      setMessage({ type: "error", text: "File size exceeds 500MB limit" });
      return;
    }

    setUploading({ ...uploading, [appIndex]: true });

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("appId", app.id);

      const response = await fetch("/api/apps/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      // Update app data with file information
      const newApps = [...appsData];
      newApps[appIndex] = {
        ...newApps[appIndex],
        file_name: data.fileName,
        file_size: data.fileSize,
        file_type: data.fileType,
        download_link: data.publicUrl,
      };
      setAppsData(newApps);

      setMessage({ type: "success", text: "File uploaded successfully!" });
      router.refresh();
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "Upload failed" });
    } finally {
      setUploading({ ...uploading, [appIndex]: false });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  const removeFile = async (appIndex: number) => {
    const app = appsData[appIndex];
    const newApps = [...appsData];
    newApps[appIndex] = {
      ...newApps[appIndex],
      file_name: "",
      file_size: 0,
      file_type: "",
      download_link: "",
    };
    setAppsData(newApps);

    // If app exists in database, update it
    if (app.id) {
      try {
        const { error } = await supabase
          .from("apps")
          .update({
            file_path: null,
            file_name: null,
            file_size: null,
            file_type: null,
            download_link: null,
          })
          .eq("id", app.id);

        if (error) throw error;
        setMessage({ type: "success", text: "File removed successfully!" });
        router.refresh();
      } catch (error: any) {
        setMessage({ type: "error", text: error.message });
      }
    }
  };

  const handleImageUpload = async (appIndex: number, file: File | null) => {
    if (!file) return;

    const app = appsData[appIndex];
    
    // Check if app is saved first
    if (!app.id) {
      setMessage({ 
        type: "error", 
        text: "Please save the app first before uploading an image. Fill in at least the title, description, and category, then click Save." 
      });
      return;
    }
    
    // Validate file type
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    const allowedExtensions = ["jpg", "jpeg", "png", "webp", "gif"];
    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
      setMessage({ type: "error", text: "Invalid file type. Only image files (JPG, PNG, WebP, GIF) are allowed." });
      return;
    }

    // Validate file size (max 10MB for images)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setMessage({ type: "error", text: "File size exceeds 10MB limit" });
      return;
    }

    setUploadingImage({ ...uploadingImage, [appIndex]: true });
    setMessage(null); // Clear previous messages

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("appId", app.id);

      const response = await fetch("/api/apps/upload-image", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      // Update app data with image information
      const newApps = [...appsData];
      newApps[appIndex] = {
        ...newApps[appIndex],
        image_path: data.filePath,
        image_url: data.publicUrl,
      };
      setAppsData(newApps);

      setMessage({ type: "success", text: "Image uploaded successfully!" });
      
      // Refresh to get updated data from server
      router.refresh();
    } catch (error: any) {
      console.error("Image upload error:", error);
      setMessage({ type: "error", text: error.message || "Upload failed. Please check the console for details." });
    } finally {
      setUploadingImage({ ...uploadingImage, [appIndex]: false });
    }
  };

  const removeImage = async (appIndex: number) => {
    const app = appsData[appIndex];
    
    if (!app.id) return;

    // Confirm deletion
    if (!confirm("Are you sure you want to delete this image? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`/api/apps/upload-image?appId=${app.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to remove image");
      }

      // Update app data
      const newApps = [...appsData];
      newApps[appIndex] = {
        ...newApps[appIndex],
        image_path: "",
        image_url: "",
      };
      setAppsData(newApps);

      setMessage({ type: "success", text: "Image deleted successfully!" });
      router.refresh();
    } catch (error: any) {
      console.error("Image deletion error:", error);
      setMessage({ type: "error", text: error.message || "Failed to delete image" });
    }
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Sync apps state with props when they change (e.g., after refresh)
  useEffect(() => {
    setAppsData(apps.map(app => ({
      id: app.id,
      title: app.title,
      description: app.description,
      category: app.category,
      download_link: app.download_link || "",
      image_url: app.image_url || "",
      image_path: app.image_path || "",
      tags: app.tags?.join(", ") || "",
      display_order: app.display_order,
      file_name: app.file_name || "",
      file_size: app.file_size || 0,
      file_type: app.file_type || "",
    })));
  }, [apps]);

  return (
    <div className="space-y-4 sm:space-y-6">
      {message && (
        <div className={`p-3 sm:p-4 rounded-lg text-sm sm:text-base ${
          message.type === "success" 
            ? "bg-green-500/10 text-green-600 border border-green-500/20" 
            : "bg-red-500/10 text-red-600 border border-red-500/20"
        }`}>
          {message.text}
        </div>
      )}

      {/* Profile Section */}
      <Card className="overflow-hidden">
        <button
          onClick={() => toggleSection("profile")}
          className="w-full p-4 sm:p-5 md:p-6 flex items-center justify-between hover:bg-accent transition-colors"
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <UserIcon className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold">Profile Information</h2>
          </div>
          {openSections.profile ? <ChevronUp className="h-5 w-5 flex-shrink-0" /> : <ChevronDown className="h-5 w-5 flex-shrink-0" />}
        </button>
        
        {openSections.profile && (
          <div className="p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4 border-t">
            <div className="space-y-2">
              <Label htmlFor="profile-name" className="text-sm">Full Name</Label>
              <Input
                id="profile-name"
                value={profileData.full_name}
                onChange={(e) => setProfileData(prev => ({ ...prev, full_name: e.target.value }))}
                placeholder="Your Name"
                className="text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-avatar" className="text-sm">Avatar URL</Label>
              <Input
                id="profile-avatar"
                value={profileData.avatar_url}
                onChange={(e) => setProfileData(prev => ({ ...prev, avatar_url: e.target.value }))}
                placeholder="https://..."
                className="text-sm"
              />
            </div>
            <Button onClick={saveProfile} disabled={saving} className="w-full sm:w-auto" size="sm">
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Saving..." : "Save Profile"}
            </Button>
          </div>
        )}
      </Card>

      {/* Home Section */}
      <Card className="overflow-hidden">
        <button
          onClick={() => toggleSection("home")}
          className="w-full p-4 sm:p-5 md:p-6 flex items-center justify-between hover:bg-accent transition-colors"
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold">Home Section</h2>
          </div>
          {openSections.home ? <ChevronUp className="h-5 w-5 flex-shrink-0" /> : <ChevronDown className="h-5 w-5 flex-shrink-0" />}
        </button>
        
        {openSections.home && (
          <div className="p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4 border-t">
            <div className="space-y-2">
              <Label htmlFor="home-title" className="text-sm">Title</Label>
              <Input
                id="home-title"
                value={homeData.title}
                onChange={(e) => setHomeData(prev => ({ ...prev, title: e.target.value }))}
                className="text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="home-subtitle" className="text-sm">Subtitle</Label>
              <Input
                id="home-subtitle"
                value={homeData.subtitle}
                onChange={(e) => setHomeData(prev => ({ ...prev, subtitle: e.target.value }))}
                className="text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="home-description" className="text-sm">Description</Label>
              <Textarea
                id="home-description"
                value={homeData.description}
                onChange={(e) => setHomeData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="text-sm"
              />
            </div>
            <Button onClick={saveHome} disabled={saving} className="w-full sm:w-auto" size="sm">
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Saving..." : "Save Home Section"}
            </Button>
          </div>
        )}
      </Card>

      {/* About Section */}
      <Card className="overflow-hidden">
        <button
          onClick={() => toggleSection("about")}
          className="w-full p-4 sm:p-5 md:p-6 flex items-center justify-between hover:bg-accent transition-colors"
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 flex-shrink-0" />
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold">About Section</h2>
          </div>
          {openSections.about ? <ChevronUp className="h-5 w-5 flex-shrink-0" /> : <ChevronDown className="h-5 w-5 flex-shrink-0" />}
        </button>
        
        {openSections.about && (
          <div className="p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-5 border-t">
            <div className="space-y-2">
              <Label htmlFor="about-description" className="text-sm">About Text</Label>
              <Textarea
                id="about-description"
                value={aboutData.description}
                onChange={(e) => setAboutData(prev => ({ ...prev, description: e.target.value }))}
                rows={6}
                className="text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="years-experience" className="text-sm">Years of Experience</Label>
              <Input
                id="years-experience"
                type="number"
                min="0"
                value={aboutData.yearsOfExperience}
                onChange={(e) => setAboutData(prev => ({ ...prev, yearsOfExperience: parseInt(e.target.value) || 0 }))}
                placeholder="e.g., 5"
                className="text-sm"
              />
              <p className="text-xs text-muted-foreground">Leave as 0 to hide the experience section</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold">Technologies & Tools</Label>
                <Button 
                  onClick={addTool} 
                  variant="outline" 
                  size="sm" 
                  className="h-8"
                >
                  <Plus className="mr-2 h-3 w-3" />
                  Add Tool
                </Button>
              </div>
              
              {aboutData.tools.length === 0 ? (
                <p className="text-xs text-muted-foreground py-2">
                  No tools added yet. Click "Add Tool" to add technologies you specialize in.
                </p>
              ) : (
                <div className="space-y-3">
                  {aboutData.tools.map((tool, index) => (
                    <Card key={index} className="p-3 sm:p-4 border-primary/20">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1.5">
                          <Label className="text-xs">Tool Name *</Label>
                          <Input
                            value={tool.name}
                            onChange={(e) => updateTool(index, "name", e.target.value)}
                            placeholder="e.g., Flutter"
                            className="text-sm h-9"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs">Icon (emoji/unicode)</Label>
                          <Input
                            value={tool.icon || ""}
                            onChange={(e) => updateTool(index, "icon", e.target.value)}
                            placeholder="💙 (optional)"
                            className="text-sm h-9"
                          />
                          <p className="text-xs text-muted-foreground">Emoji or icon character</p>
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs">Category</Label>
                          <Input
                            value={tool.category || ""}
                            onChange={(e) => updateTool(index, "category", e.target.value)}
                            placeholder="e.g., Framework (optional)"
                            className="text-sm h-9"
                          />
                        </div>
                      </div>
                      <Button
                        onClick={() => removeTool(index)}
                        variant="ghost"
                        size="sm"
                        className="mt-2 h-7 text-xs text-destructive hover:text-destructive"
                      >
                        <Trash2 className="mr-1 h-3 w-3" />
                        Remove
                      </Button>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            <Button onClick={saveAbout} disabled={saving} className="w-full sm:w-auto" size="sm">
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Saving..." : "Save About Section"}
            </Button>
          </div>
        )}
      </Card>

      {/* Apps Section */}
      <Card className="overflow-hidden">
        <button
          onClick={() => toggleSection("apps")}
          className="w-full p-4 sm:p-5 md:p-6 flex items-center justify-between hover:bg-accent transition-colors"
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <AppWindow className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600 flex-shrink-0" />
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold">My Apps</h2>
          </div>
          {openSections.apps ? <ChevronUp className="h-5 w-5 flex-shrink-0" /> : <ChevronDown className="h-5 w-5 flex-shrink-0" />}
        </button>
        
        {openSections.apps && (
          <div className="p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-6 border-t">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <p className="text-sm text-muted-foreground">Manage your portfolio apps</p>
              <Button onClick={addNewApp} variant="outline" size="sm" className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Add New App
              </Button>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {appsData.map((app, index) => (
                <Card key={index} className="p-4 sm:p-5 md:p-6 border-primary/20">
                  <div className="space-y-3 sm:space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm">Title</Label>
                        <Input
                          value={app.title}
                          onChange={(e) => {
                            const newApps = [...appsData];
                            newApps[index].title = e.target.value;
                            setAppsData(newApps);
                          }}
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm">Category</Label>
                        <Input
                          value={app.category}
                          onChange={(e) => {
                            const newApps = [...appsData];
                            newApps[index].category = e.target.value;
                            setAppsData(newApps);
                          }}
                          className="text-sm"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Description</Label>
                      <Textarea
                        value={app.description}
                        onChange={(e) => {
                          const newApps = [...appsData];
                          newApps[index].description = e.target.value;
                          setAppsData(newApps);
                        }}
                        rows={3}
                        className="text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">App File (.apk or .ipa)</Label>
                      {app.file_name ? (
                        <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <File className="h-4 w-4 text-primary flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{app.file_name}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatFileSize(app.file_size)} • {app.file_type ? app.file_type.toUpperCase() : ''}
                              </p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                            className="flex-shrink-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <label
                              htmlFor={`file-upload-${index}`}
                              className="flex-1 cursor-pointer"
                            >
                              <div className={`flex items-center justify-center gap-2 p-4 border-2 border-dashed rounded-lg transition-colors ${
                                !app.id ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent cursor-pointer'
                              }`}>
                                <Upload className="h-5 w-5 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                  {!app.id ? 'Save the app first to upload file' : 'Click to upload .apk or .ipa file'}
                                </span>
                              </div>
                              <input
                                id={`file-upload-${index}`}
                                type="file"
                                accept=".apk,.ipa"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    handleFileUpload(index, file);
                                  }
                                }}
                                disabled={uploading[index] || !app.id}
                              />
                            </label>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Maximum file size: 500MB. Supported formats: .apk (Android), .ipa (iOS)
                          </p>
                        </div>
                      )}
                      {uploading[index] && (
                        <p className="text-xs text-muted-foreground">Uploading...</p>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm">
                          Download Link {app.file_name && "(auto-filled from upload)"}
                        </Label>
                        <Input
                          value={app.download_link || ""}
                          onChange={(e) => {
                            const newApps = [...appsData];
                            newApps[index].download_link = e.target.value;
                            setAppsData(newApps);
                          }}
                          placeholder={app.file_name ? "Will use uploaded file" : "External download URL"}
                          disabled={!!app.file_name}
                          className="text-sm"
                        />
                        {!app.file_name && (
                          <p className="text-xs text-muted-foreground">
                            Or provide an external download URL if not uploading a file
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm">App Image</Label>
                        {app.image_url && app.image_path ? (
                          <div className="space-y-2">
                            <div className="relative w-full aspect-video border rounded-lg overflow-hidden bg-muted">
                              <img 
                                src={app.image_url} 
                                alt={app.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  // Fallback if image fails to load
                                  console.error("Image failed to load:", app.image_url);
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-xs text-muted-foreground flex-1 min-w-0 truncate">
                                Uploaded: {app.image_path.split('/').pop()}
                              </p>
                              <div className="flex gap-2">
                                <label
                                  htmlFor={`image-upload-${index}`}
                                  className="cursor-pointer"
                                >
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    disabled={uploadingImage[index] || !app.id}
                                    asChild
                                  >
                                    <span>
                                      <Edit3 className="mr-2 h-4 w-4" />
                                      {uploadingImage[index] ? "Uploading..." : "Update"}
                                    </span>
                                  </Button>
                                  <input
                                    id={`image-upload-${index}`}
                                    type="file"
                                    accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                                    className="hidden"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        handleImageUpload(index, file);
                                      }
                                    }}
                                    disabled={uploadingImage[index] || !app.id}
                                  />
                                </label>
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => removeImage(index)}
                                  disabled={uploadingImage[index]}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </div>
                        ) : app.image_url && !app.image_path ? (
                          <div className="space-y-2">
                            <div className="relative w-full aspect-video border rounded-lg overflow-hidden bg-muted">
                              <img 
                                src={app.image_url} 
                                alt={app.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  console.error("Image failed to load:", app.image_url);
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-xs text-muted-foreground flex-1">
                                External image URL
                              </p>
                              <div className="flex gap-2">
                                <label
                                  htmlFor={`image-upload-${index}`}
                                  className="cursor-pointer"
                                >
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    disabled={uploadingImage[index] || !app.id}
                                    asChild
                                  >
                                    <span>
                                      <Upload className="mr-2 h-4 w-4" />
                                      {uploadingImage[index] ? "Uploading..." : "Upload Image"}
                                    </span>
                                  </Button>
                                  <input
                                    id={`image-upload-${index}`}
                                    type="file"
                                    accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                                    className="hidden"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        handleImageUpload(index, file);
                                      }
                                    }}
                                    disabled={uploadingImage[index] || !app.id}
                                  />
                                </label>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const newApps = [...appsData];
                                    newApps[index].image_url = "";
                                    setAppsData(newApps);
                                  }}
                                >
                                  <X className="mr-2 h-4 w-4" />
                                  Clear
                                </Button>
                              </div>
                            </div>
                            <Input
                              value={app.image_url || ""}
                              onChange={(e) => {
                                const newApps = [...appsData];
                                newApps[index].image_url = e.target.value;
                                setAppsData(newApps);
                              }}
                              placeholder="https://example.com/image.jpg"
                              className="text-sm"
                            />
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <label
                                htmlFor={`image-upload-${index}`}
                                className="flex-1 cursor-pointer"
                              >
                                <div className={`flex items-center justify-center gap-2 p-4 border-2 border-dashed rounded-lg transition-colors ${
                                  !app.id ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent cursor-pointer'
                                }`}>
                                  <ImageIcon className="h-5 w-5 text-muted-foreground" />
                                  <span className="text-sm text-muted-foreground">
                                    {!app.id ? 'Save the app first to upload image' : 'Click to upload app image'}
                                  </span>
                                </div>
                                <input
                                  id={`image-upload-${index}`}
                                  type="file"
                                  accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      handleImageUpload(index, file);
                                    }
                                  }}
                                  disabled={uploadingImage[index] || !app.id}
                                />
                              </label>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Maximum file size: 10MB. Supported formats: JPG, PNG, WebP, GIF
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Or you can enter an external image URL below
                            </p>
                            <Input
                              value={app.image_url || ""}
                              onChange={(e) => {
                                const newApps = [...appsData];
                                newApps[index].image_url = e.target.value;
                                setAppsData(newApps);
                              }}
                              placeholder="https://example.com/image.jpg"
                              className="text-sm"
                              disabled={!!app.image_path}
                            />
                            {app.image_path && (
                              <p className="text-xs text-muted-foreground">
                                Remove uploaded image to use external URL
                              </p>
                            )}
                          </div>
                        )}
                        {uploadingImage[index] && (
                          <p className="text-xs text-muted-foreground">Uploading...</p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Tags (comma separated)</Label>
                      <Input
                        value={app.tags}
                        onChange={(e) => {
                          const newApps = [...appsData];
                          newApps[index].tags = e.target.value;
                          setAppsData(newApps);
                        }}
                        placeholder="iOS, Android, Task Management"
                        className="text-sm"
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button onClick={() => saveApp(app)} disabled={saving} className="flex-1 sm:flex-initial" size="sm">
                        <Save className="mr-2 h-4 w-4" />
                        Save
                      </Button>
                      {app.id && (
                        <Button 
                          onClick={() => deleteApp(app.id)} 
                          variant="destructive"
                          disabled={saving}
                          size="sm"
                          className="w-full sm:w-auto"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Contact Section */}
      <Card className="overflow-hidden">
        <button
          onClick={() => toggleSection("contact")}
          className="w-full p-4 sm:p-5 md:p-6 flex items-center justify-between hover:bg-accent transition-colors"
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 flex-shrink-0" />
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold">Contact Information</h2>
          </div>
          {openSections.contact ? <ChevronUp className="h-5 w-5 flex-shrink-0" /> : <ChevronDown className="h-5 w-5 flex-shrink-0" />}
        </button>
        
        {openSections.contact && (
          <div className="p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4 border-t">
            <div className="space-y-2">
              <Label htmlFor="contact-email" className="text-sm">Email</Label>
              <Input
                id="contact-email"
                value={contactData.email}
                onChange={(e) => setContactData(prev => ({ ...prev, email: e.target.value }))}
                type="email"
                className="text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-description" className="text-sm">Description</Label>
              <Textarea
                id="contact-description"
                value={contactData.description}
                onChange={(e) => setContactData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="text-sm"
              />
            </div>
            <Button onClick={saveContact} disabled={saving} className="w-full sm:w-auto" size="sm">
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Saving..." : "Save Contact Information"}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}




