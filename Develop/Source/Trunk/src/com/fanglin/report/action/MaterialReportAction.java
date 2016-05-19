/**
 * @File Name		: MaterialReportAction.java
 * @Package   	: com.fanglin.action.materialOrder
 * @Version		: 1.0
 * @Date			: 2014-11-15
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.report.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.report.service.MaterialReportService;
import com.fanglin.report.vo.MaterialBrandCountVO;
import com.fanglin.report.vo.MaterialDepartmentCountVO;
import com.fanglin.report.vo.MaterialTypeCountVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class MaterialReportAction extends BaseListAction {

	private static final long serialVersionUID = 3195285060809886106L;
	
	@Autowired
	private MaterialReportService materialReportService;
	
	private List<MaterialTypeCountVO> materialTypeCounts;
	
	private List<MaterialBrandCountVO> materialBrandCounts;
	
	private List<MaterialDepartmentCountVO> materialDepartmentCounts;
	
	private int reportType;
	
	private List<?> designers;
	
	private List<?> designerDepartments;
	
	private List<?> designerRegions;
	
	@Action(value="materialTypeReport", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String materialTypeReport(){
		
		materialTypeCounts = materialReportService.reportMaterialTypeCount(getFilters());
		
		return SUCCESS;
	}
	
	@Action(value="materialBrandReport", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String materialBrandReport(){
		
		materialBrandCounts = materialReportService.reportMaterialBrandCount(getFilters());
		
		return SUCCESS;
	}
	
	@Action(value="materialDepartmentReport", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String materialDepartmentReport(){
		
		materialDepartmentCounts = materialReportService.reportMaterialDepartmentCount(getFilters());
		
		return SUCCESS;
	}
	
	@Action(value="designerReport", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String designerReport() throws FLException{
		
		if(reportType == 1){
			designers = materialReportService.reportMaterialDesignerCount(getFilters());
		}else if(reportType == 2){
			designers = materialReportService.reportZaterialDesignerCount(getFilters());
		}else{
			throw new FLException(210001, "报表类型错误");
		}
		
		return SUCCESS;
	}
	
	@Action(value="designerDeportmentReport", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String designerDeportmentReport() throws FLException{
		
		if(reportType == 1){
			designerDepartments = materialReportService.reportMaterialDesignerDepartmentCount(getFilters());
		}else if(reportType == 2){
			designerDepartments = materialReportService.reportZaterialDesignerDepartmentCount(getFilters());
		}else{
			throw new FLException(210001, "报表类型错误");
		}
		
		return SUCCESS;
	}
	
	@Action(value="designerRegionReport", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String designerRegionReport() throws FLException{
		
		if(reportType == 1){
			designerRegions = materialReportService.reportMaterialDesignerRegionCount(getFilters());
		}else if(reportType == 2){
			designerRegions = materialReportService.reportZaterialDesignerRegionCount(getFilters());
		}else{
			throw new FLException(210001, "报表类型错误");
		}
		
		return SUCCESS;
	}
	
	@Action(value="countMaterialType", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String countMaterialType(){
		
		materialTypeCounts = materialReportService.countMaterialTypeCount(getFilters());
		
		return SUCCESS;
	}
	
	@Action(value="countMaterialBrand", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String countMaterialBrand(){
		
		materialBrandCounts = materialReportService.countMaterialBrandCount(getFilters());
		
		return SUCCESS;
	}
	
	@Action(value="countDesigner", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String countDesigner() throws FLException{
		
		if(reportType == 1){
			designers = materialReportService.countMaterialDesignerCount(getFilters());
		}else if(reportType == 2){
			designers = materialReportService.countZaterialDesignerCount(getFilters());
		}else{
			throw new FLException(210001, "报表类型错误");
		}
		
		return SUCCESS;
	}
	
	@Action(value="countDesignerDepartment", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String countDesignerDepartment() throws FLException{
		
		if(reportType == 1){
			designerDepartments = materialReportService.countMaterialDesignerDepartmentCount(getFilters());
		}else if(reportType == 2){
			designerDepartments = materialReportService.countZaterialDesignerDepartmentCount(getFilters());
		}else{
			throw new FLException(210001, "报表类型错误");
		}
		
		return SUCCESS;
	}
	
	@Action(value="countDesignerRegion", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String countDesignerRegion() throws FLException{
		
		if(reportType == 1){
			designerRegions = materialReportService.countMaterialDesignerRegionCount(getFilters());
		}else if(reportType == 2){
			designerRegions = materialReportService.countZaterialDesignerRegionCount(getFilters());
		}else{
			throw new FLException(210001, "报表类型错误");
		}
		
		return SUCCESS;
	}

	public int getReportType(){
		return reportType;
	}

	public void setReportType(int reportType){
		this.reportType = reportType;
	}

	public List<?> getDesignerDepartments(){
		return designerDepartments;
	}

	public void setDesignerDepartments(List<?> designerDepartments){
		this.designerDepartments = designerDepartments;
	}

	public List<?> getDesignerRegions(){
		return designerRegions;
	}

	public void setDesignerRegions(List<?> designerRegions){
		this.designerRegions = designerRegions;
	}

	public List<MaterialDepartmentCountVO> getMaterialDepartmentCounts(){
		return materialDepartmentCounts;
	}

	public void setMaterialDepartmentCounts(List<MaterialDepartmentCountVO> materialDepartmentCounts){
		this.materialDepartmentCounts = materialDepartmentCounts;
	}

	public List<MaterialTypeCountVO> getMaterialTypeCounts() {
		return materialTypeCounts;
	}

	public void setMaterialTypeCounts(List<MaterialTypeCountVO> materialTypeCounts) {
		this.materialTypeCounts = materialTypeCounts;
	}

	public List<MaterialBrandCountVO> getMaterialBrandCounts() {
		return materialBrandCounts;
	}

	public void setMaterialBrandCounts(
			List<MaterialBrandCountVO> materialBrandCounts) {
		this.materialBrandCounts = materialBrandCounts;
	}

	public List<?> getDesigners() {
		return designers;
	}

	public void setDesigners(List<?> designers) {
		this.designers = designers;
	}

}
