/**
 * @File Name		: SalaryIndexAction.java
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
public class SalaryIndexAction extends BaseListAction {

	private static final long serialVersionUID = -8507962597198848750L;
	
	@Action(value = "designerSalaryIndex", results = { @Result(name = "success", type = "dispatcher", location = "/views/salary/designerSalary.html")})
	public String designerSalaryIndex(){
		return SUCCESS;
	}
	
	@Action(value = "designerBalanceSalaryIndex", results = { @Result(name = "success", type = "dispatcher", location = "/views/salary/designerBalanceSalary.html")})
	public String designerBalanceSalary(){
		return SUCCESS;
	}
	
	@Action(value = "designerOutsideSalaryIndex", results = { @Result(name = "success", type = "dispatcher", location = "/views/salary/designerOutsideSalary.html")})
	public String designerOutsideSalaryIndex(){
		return SUCCESS;
	}
	
	@Action(value = "designerDeductSalaryIndex", results = { @Result(name = "success", type = "dispatcher", location = "/views/salary/designerDeductSalary.html")})
	public String designerDeductSalaryIndex(){
		return SUCCESS;
	}
	
	@Action(value = "venderBalanceIndex", results = { @Result(name = "success", type = "dispatcher", location = "/views/salary/venderBalance.html")})
	public String venderBalanceIndex(){
		return SUCCESS;
	}
	
	@Action(value = "workerSalaryIndex", results = { @Result(name = "success", type = "dispatcher", location = "/views/salary/workerSalary.html")})
	public String workerSalaryIndex(){
		return SUCCESS;
	}

	@Action(value = "workerBaseSalaryScheduleIndex", results = { @Result(name = "success", type = "dispatcher", location = "/views/salary/workerBaseSalarySchedule.html")})
	public String workerBaseSalaryScheduleIndex(){
		return SUCCESS;
	}
	
	@Action(value = "workerBaseSalaryScheduleDetailIndex", results = { @Result(name = "success", type = "dispatcher", location = "/views/salary/workerBaseSalaryScheduleDetail.html")})
	public String workerBaseSalaryScheduleDetailIndex(){
		return SUCCESS;
	}
	
	@Action(value = "workerDeductSalaryScheduleDetailIndex", results = { @Result(name = "success", type = "dispatcher", location = "/views/salary/workerDeductSalaryScheduleDetail.html")})
	public String workerDeductSalaryScheduleDetailIndex(){
		return SUCCESS;
	}
	
	@Action(value = "workerBaseSalaryIndex", results = { @Result(name = "success", type = "dispatcher", location = "/views/salary/workerBaseSalary.html")})
	public String workerBaseSalaryIndex(){
		return SUCCESS;
	}
	
	@Action(value = "workerDeductSalaryIndex", results = { @Result(name = "success", type = "dispatcher", location = "/views/salary/workerDeductSalary.html")})
	public String workerDeductSalaryIndex(){
		return SUCCESS;
	}

}
