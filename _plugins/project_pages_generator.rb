# Generates one page per project listed in _data/portfolio.json at
# /work/<slug>/ using the post.html layout. Keeping the projects as
# data (rather than individual markdown files) means the admin CRUD panel
# only ever has to read/write a single JSON file to add, edit, or remove
# a project.
module RichardBarberCreative
  class ProjectPage < Jekyll::PageWithoutAFile
    def initialize(site, project)
      @site = site
      @base = site.source
      @dir = File.join("portfolio", project["slug"].to_s)
      @name = "index.html"

      process(@name)
      self.data = project.merge(
        "layout" => "post",
        "permalink" => "/work/#{project['slug']}/"
      )
      self.content = ""
    end
  end

  class ProjectPagesGenerator < Jekyll::Generator
    safe true

    # Builds a flat, cross-project list of every image (main + gallery) in
    # portfolio order, and stamps each project with the index of its first
    # image in that list (`_gallery_start`). The lightbox uses this so that
    # paging past the last photo of one project continues straight into the
    # next project's photos, instead of stopping at each project's edge.
    def generate(site)
      projects = site.data.dig("portfolio", "projects") || []
      flat_images = []

      projects.each do |project|
        next if project["slug"].to_s.empty?

        project["_gallery_start"] = flat_images.length
        project_url = "/work/#{project['slug']}/"

        flat_images << {
          "src" => project["main_image_url"],
          "alt" => project["main_image_alt_text"],
          "project_title" => project["title"],
          "project_category" => project["category"],
          "project_description" => project["description"],
          "project_url" => project_url
        }
        (project["gallery_images"] || []).each do |img|
          flat_images << {
            "src" => img["url"],
            "alt" => img["alt_text"],
            "project_title" => project["title"],
            "project_category" => project["category"],
            "project_description" => project["description"],
            "project_url" => project_url
          }
        end

        site.pages << ProjectPage.new(site, project)
      end

      site.data["lightbox"] = flat_images
    end
  end
end
