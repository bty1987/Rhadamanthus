/**
 * @File Name		: MeasurementUnitAction.java
 * @Package   	: com.fanglin.action
 * @Version		: 1.0
 * @Date			: 2014-7-29
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.common.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.common.service.MeasurementUnitService;
import com.fanglin.common.vo.MeasurementUnitVO;
import com.fanglin.core.action.BaseListAction;

@ParentPackage("base")
@Namespace("/")
@Controller
public class MeasurementUnitAction extends BaseListAction {

	private static final long serialVersionUID = 3536987267675442274L;
	
	@Autowired
	private MeasurementUnitService measurementUnitService;
	
	private List<MeasurementUnitVO> measurementUnits;
	
	@Action(value="queryMeasurementUnit", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryMeasurementUnit(){
		
		measurementUnits = measurementUnitService.queryMeasurementUnit();
		
		return SUCCESS;
	}

	public List<MeasurementUnitVO> getMeasurementUnits(){
		return measurementUnits;
	}

	public void setMeasurementUnits(List<MeasurementUnitVO> measurementUnits){
		this.measurementUnits = measurementUnits;
	}
	
}
