/**
 * @File Name		: ConstrutctionIndexAction.java
 * @Package   	: com.fanglin.common.action
 * @Version		: 1.0
 * @Date			: 2015-5-7
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.index.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ConstrutctionIndexAction extends BaseListAction {

	private static final long serialVersionUID = 3152101859020918126L;
	
	@Action(value = "supervisionIndex", results={@Result(name="success", type="dispatcher", location="/views/construction/supervision.html")})
	public String supervisionIndex(){
		return SUCCESS;
	}
	
	@Action(value = "supervisionDetailIndex", results = {@Result(name = "success", type = "dispatcher", location = "/views/construction/supervisionDetail.html")})
	public String supervisionDetailIndex(){
		return SUCCESS;
	}
	
	@Action(value = "supervisionInDecreaseIndex", results = {@Result(name = "success", type = "dispatcher", location = "/views/construction/supervisionInDecrease.html")})
	public String supervisionInDecreaseIndex(){
		return SUCCESS;
	}
	
	@Action(value = "reworkIndex", results = {@Result(name = "success", type = "dispatcher", location = "/views/construction/rework.html")})
	public String reworkIndex(){
		return SUCCESS;
	}
	
	@Action(value = "inspectionIndex", results = {@Result(name = "success", type = "dispatcher", location = "/views/construction/inspection.html")})
	public String inspectionIndex(){
		return SUCCESS;
	}
	
	@Action(value = "onsiteInspectionRecordIndex", results = {@Result(name = "success", type = "dispatcher", location = "/views/construction/onsiteInspectionRecord.html")})
	public String onsiteInspectionRecordIndex(){
		return SUCCESS;
	}
	
	@Action(value = "onsiteInspectionDeductionIndex", results = {@Result(name = "success", type = "dispatcher", location = "/views/construction/onsiteInspectionDeduction.html")})
	public String onsiteInspectionDeductionIndex(){
		return SUCCESS;
	}
	
	@Action(value = "qualityTestingIndex", results = {@Result(name = "success", type = "dispatcher", location = "/views/construction/qualityTesting.html")})
	public String qualityTestingIndex(){
		return SUCCESS;
	}
	
	@Action(value = "qualityTestingDetailIndex", results = {@Result(name = "success", type = "dispatcher", location = "/views/construction/qualityTestingDetail.html")})
	public String qualityTestingDetailIndex(){
		return SUCCESS;
	}
	
	@Action(value = "qualityTestingRecordIndex", results = {@Result(name = "success", type = "dispatcher", location = "/views/construction/qualityTestingRecord.html")})
	public String qualityTestingRecordIndex(){
		return SUCCESS;
	}
	
	@Action(value = "customerServiceIndex", results={@Result(name="success", type="dispatcher", location = "/views/construction/customerService.html")})
	public String customerServiceIndex(){
		return SUCCESS;
	}
	
	@Action(value = "customerServiceDetailIndex", results={@Result(name="success", type="dispatcher", location = "/views/construction/customerServiceDetail.html")})
	public String customerServiceDetailIndex(){
		return SUCCESS;
	}
	
	@Action(value = "drawLineApplyIndex", results = { @Result(name = "success", type = "dispatcher", location = "/views/drawLine/drawLineApply.html")})
	public String drawLineIndex(){
		return SUCCESS;
	}
	
	@Action(value = "drawLineDeploymentIndex", results = { @Result(name = "success", type = "dispatcher", location = "/views/drawLine/drawLineDeployment.html")})
	public String drawLineDeploymentIndex(){
		return SUCCESS;
	}
	
	@Action(value = "drawLinePersonInfoIndex", results = { @Result(name = "success", type = "dispatcher", location = "/views/drawLine/drawLinePersonInfo.html")})
	public String drawLinePersonInfoIndex(){
		return SUCCESS;
	}
	
	@Action(value = "inspectionDeductionIndex", results = {@Result(name = "success", type = "dispatcher", location = "/views/construction/inspectionDeduction.html")})
	public String inspectionDeductionIndex(){
		return SUCCESS;
	}
	
	@Action(value = "inspectionRecordIndex", results = {@Result(name = "success", type = "dispatcher", location = "/views/construction/inspectionRecord.html")})
	public String inspectionRecordIndex(){
		return SUCCESS;
	}
	
	@Action(value="acceptanceIndex", results={@Result(name="success", type="dispatcher", location="/views/construction/acceptance.html")})
	public String acceptanceIndex(){
		return SUCCESS;
	}
	
	@Action(value="acceptanceDetailIndex", results={@Result(name="success", type="dispatcher", location="/views/construction/acceptanceDetail.html")})
	public String acceptanceDetailIndex(){
		return SUCCESS;
	}
	
	@Action(value="supervisionAddReduceIndex", results={@Result(name="success", type="dispatcher", location="/views/construction/supervisionAddReduce.html")})
	public String quotationItemIndex(){
		return SUCCESS;
	}
	
	@Action(value="customerServiceBackVisitIndex", results={@Result(name="success", type="dispatcher", location="/views/construction/customerServiceBackVisit.html")})
	public String customerServiceBackVisitIndex(){
		return SUCCESS;
	}
	
	@Action(value="customerServiceComplaintIndex", results={@Result(name="success", type="dispatcher", location="/views/construction/customerServiceComplaint.html")})
	public String customerServiceComplaint(){
		return SUCCESS;
	}
	
	@Action(value="customerServiceGuaranteeIndex", results={@Result(name="success", type="dispatcher", location="/views/construction/customerServiceGuarantee.html")})
	public String customerServiceGuaranteeIndex(){
		return SUCCESS;
	}
	
	@Action(value="supervisionReworkIndex", results={@Result(name="success", type="dispatcher", location="/views/construction/supervisionRework.html")})
	public String supervisionReworkIndex(){
		return SUCCESS;
	}
	
	@Action(value="supervisionReworkDrawingIndex", results={@Result(name="success", type="dispatcher", location="/views/construction/supervisionReworkDrawing.html")})
	public String supervisionReworkDrawingIndex(){
		return SUCCESS;
	}
	
	@Action(value="workerAllocationIndex", results={@Result(name="success", type="dispatcher", location="/views/construction/workerAllocation.html")})
	public String workerAllocationIndex(){
		return SUCCESS;
	}
	
	@Action(value="workerAllocationDetailIndex", results={@Result(name="success", type="dispatcher", location="/views/construction/workerAllocationDetail.html")})
	public String workerAllocationDetailIndex(){
		return SUCCESS;
	}
	
}
