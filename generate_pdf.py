import sys
from fpdf import FPDF

class ProgressPDF(FPDF):
    def header(self):
        # Top banner
        self.set_fill_color(15, 23, 42) # Slate 900
        self.rect(0, 0, 210, 8, 'F')
        self.set_y(14)
        
    def footer(self):
        self.set_y(-14)
        self.set_font("Helvetica", "I", 8)
        self.set_text_color(148, 163, 184) # Slate 400
        self.cell(0, 8, "EcoTrade OS  |  ALTHON 2.0 Hackathon  |  Prepared by team dev", align="C")

def create_progress_pdf():
    pdf = ProgressPDF(orientation='P', unit='mm', format='A4')
    pdf.set_auto_page_break(auto=True, margin=16)
    pdf.add_page()
    
    # Header tag
    pdf.set_font("Helvetica", "B", 9)
    pdf.set_text_color(5, 150, 105) # Emerald 600
    pdf.cell(0, 5, "ALTHON 2.0  --  24-HOUR HACKATHON PROGRESS DOSSIER", new_x="LMARGIN", new_y="NEXT")
    
    # Main Title
    pdf.set_font("Helvetica", "B", 20)
    pdf.set_text_color(15, 23, 42) # Slate 900
    pdf.cell(0, 9, "Project Progress Log", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(3)
    
    # Team Metadata Box
    pdf.set_fill_color(248, 250, 252) # Slate 50
    pdf.set_draw_color(226, 232, 240) # Slate 200
    pdf.rect(14, pdf.get_y(), 182, 18, 'DF')
    
    start_y = pdf.get_y()
    
    # Col 1: Team Name
    pdf.set_xy(18, start_y + 3)
    pdf.set_font("Helvetica", "B", 8)
    pdf.set_text_color(100, 116, 139)
    pdf.cell(45, 4, "TEAM NAME")
    pdf.set_xy(18, start_y + 8)
    pdf.set_font("Helvetica", "B", 11)
    pdf.set_text_color(15, 23, 42)
    pdf.cell(45, 5, "team dev")
    
    # Col 2: Members
    pdf.set_xy(68, start_y + 3)
    pdf.set_font("Helvetica", "B", 8)
    pdf.set_text_color(100, 116, 139)
    pdf.cell(80, 4, "TEAM MEMBERS")
    pdf.set_xy(68, start_y + 8)
    pdf.set_font("Helvetica", "B", 10)
    pdf.set_text_color(15, 23, 42)
    pdf.cell(80, 5, "Dheeraj, Mahesh, Jeshwanth, Revan")
    
    # Col 3: Project Title
    pdf.set_xy(150, start_y + 3)
    pdf.set_font("Helvetica", "B", 8)
    pdf.set_text_color(100, 116, 139)
    pdf.cell(40, 4, "PROJECT TITLE")
    pdf.set_xy(150, start_y + 8)
    pdf.set_font("Helvetica", "B", 11)
    pdf.set_text_color(5, 150, 105)
    pdf.cell(40, 5, "EcoTrade OS")
    
    pdf.set_xy(14, start_y + 22)
    
    # Section: Problem Statement (HMW)
    pdf.set_fill_color(240, 253, 244) # Emerald 50
    pdf.set_draw_color(34, 197, 94)   # Emerald 500
    
    hmw_text = '"How might we help local shopkeepers effortlessly manage their inventory and build customer loyalty, while motivating businesses to adopt and source from sustainable, eco-friendly suppliers?"'
    
    hmw_box_y = pdf.get_y()
    pdf.rect(14, hmw_box_y, 182, 22, 'DF')
    # Green accent bar on left
    pdf.set_fill_color(22, 163, 74)
    pdf.rect(14, hmw_box_y, 3, 22, 'F')
    
    pdf.set_xy(20, hmw_box_y + 2)
    pdf.set_font("Helvetica", "B", 8)
    pdf.set_text_color(21, 128, 61) # Emerald 700
    pdf.cell(0, 4, "PROBLEM STATEMENT (HOW MIGHT WE)")
    
    pdf.set_xy(20, hmw_box_y + 7)
    pdf.set_font("Helvetica", "BI", 10)
    pdf.set_text_color(20, 83, 45) # Emerald 900
    pdf.multi_cell(172, 5, hmw_text)
    
    pdf.set_xy(14, hmw_box_y + 26)
    
    def render_section(title, items):
        # Section Header
        pdf.set_font("Helvetica", "B", 11)
        pdf.set_text_color(15, 23, 42)
        pdf.cell(0, 6, title.upper(), new_x="LMARGIN", new_y="NEXT")
        
        # Divider line
        pdf.set_draw_color(226, 232, 240)
        pdf.line(14, pdf.get_y(), 196, pdf.get_y())
        pdf.ln(2)
        
        for heading, body in items:
            pdf.set_font("Helvetica", "B", 9.5)
            pdf.set_text_color(30, 41, 59)
            pdf.cell(0, 4.5, f"- {heading}: ", new_x="LMARGIN", new_y="NEXT")
            
            pdf.set_x(18)
            pdf.set_font("Helvetica", "", 9)
            pdf.set_text_color(71, 85, 105)
            pdf.multi_cell(176, 4.2, body)
            pdf.ln(1.5)
        pdf.ln(2)

    # 1. Proposed Solution
    solution_items = [
        ("Adaptive Store Setup", "An interface that scales to the shop's operational needs - giving Kirana stores and pharmacies simple daily inventory and billing tools, while offering suppliers a clear format to document their sustainability practices."),
        ("Low-Friction Daily Management", "Eliminates tedious manual typing through quick voice-based stock logging, and introduces a simple phone-number visit tracker so merchants can reward repeat shoppers without expensive POS hardware."),
        ("Circular Green Incentives", "Directly rewards shoppers who bring reusable bags with instant checkout discounts, and enables shopkeepers to easily discover and stock products from verified eco-conscious suppliers.")
    ]
    render_section("Proposed Solution", solution_items)
    
    # 2. Relevance
    relevance_items = [
        ("Grassroots Retail Need", "Local Kirana stores and neighbourhood pharmacies run on thin margins and manual registers. They face heavy competition from quick-commerce delivery apps and lack simple tools to track demand and retain loyal repeat customers."),
        ("Practical Environmental Action", "While customers and store owners care about eco-friendly choices, there is no straightforward mechanism for small businesses to evaluate supplier sustainability, or to reward customers who practice reusable habits."),
        ("Unified Value", "Bridging everyday shop operations with sustainability incentives makes going green practical and rewarding, rather than an extra compliance burden.")
    ]
    render_section("Relevance & Real-World Impact", relevance_items)
    
    # 3. Feasibility
    feasibility_items = [
        ("Modular 4-Person Scope", "The system divides cleanly into independent modules that our 4-member team can build in parallel: frontend shop flow, inventory database, customer loyalty logic, and the supplier sustainability rating."),
        ("Reliable Tech Stack", "Built using responsive React, a lightweight backend API, and browser-native speech recognition for voice input, avoiding heavy or fragile external dependencies."),
        ("Focused Working Demo", "Our goal is a tight, working core prototype: a shopkeeper logs stock, bills a customer via phone number with an eco-discount, and checks supplier green ratings. Clean, stable, and easy to demonstrate.")
    ]
    render_section("Feasibility & Delivery Strategy", feasibility_items)
    
    # Output file
    output_path = r"c:\Users\user\OneDrive\Documents\team dev\EcoTrade_OS_Progress.pdf"
    pdf.output(output_path)
    print(f"SUCCESS: {output_path}")

if __name__ == "__main__":
    create_progress_pdf()
