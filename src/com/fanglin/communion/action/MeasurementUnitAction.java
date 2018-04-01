package com.fanglin.communion.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.communion.service.MeasurementUnitService;
import com.fanglin.communion.vo.MeasurementUnitVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.utils.SystemConfig;

@ParentPackage("base")
@Namespace("/")
@Controller
public class MeasurementUnitAction extends BaseListAction {

	private static final long serialVersionUID = 3536987267675442274L;
	
	@Autowired
	private MeasurementUnitService measurementUnitService;
	
	private List<MeasurementUnitVO> measurementUnits;
	
	private MeasurementUnitVO measurementUnit;
	
	@Action(value="pageMeasurementUnit", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageDrawLineGroup(){
		
		measurementUnits = measurementUnitService.pageMeasurementUnit(getPaging(), getFilters());
		
		return SUCCESS;
	}
	
	@Action(value="queryMeasurementUnit", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryMeasurementUnit(){
		
		measurementUnits = measurementUnitService.queryMeasurementUnit();
		
		return SUCCESS;
	}
	
	@Action(value="addMeasurementUnit", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String addMeasurementUnit() throws FLException{
		
		if(SystemConfig.getString("communion") == null){
		    throw new FLException(-1, "无操作权限");
		}
		
		measurementUnitService.addMeasurementUnit(measurementUnit);
		
		return SUCCESS;
	}
	
	@Action(value="updateMeasurementUnit", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updateMeasurementUnit() throws FLException{
		
		if(SystemConfig.getString("communion") == null){
		    throw new FLException(-1, "无操作权限");
		}
		
		measurementUnitService.updateMeasurementUnit(measurementUnit);
		
		return SUCCESS;
	}

	public List<MeasurementUnitVO> getMeasurementUnits(){
		return measurementUnits;
	}

	public void setMeasurementUnits(List<MeasurementUnitVO> measurementUnits){
		this.measurementUnits = measurementUnits;
	}

	public MeasurementUnitVO getMeasurementUnit() {
		return measurementUnit;
	}

	public void setMeasurementUnit(MeasurementUnitVO measurementUnit) {
		this.measurementUnit = measurementUnit;
	}
	
}
