package com.fanglin.salary.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.salary.service.SalaryDrawingService;
import com.fanglin.salary.vo.SalaryDrawingVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class SalaryDrawingAction extends BaseListAction {

	private static final long serialVersionUID = -3165398551277430051L;

	@Autowired
	private SalaryDrawingService salaryDrawingService;

	private SalaryDrawingVO salaryDrawing;

	private List<SalaryDrawingVO> salaryDrawings;

	@Action(value = "querySalaryDrawing", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String querySalesPicture() throws FLException {

		salaryDrawings = salaryDrawingService.querySalaryDrawing(salaryDrawing);

		return SUCCESS;
	}

	@Action(value = "addSalaryDrawing", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addSalesPicture() throws FLException {

		salaryDrawingService.addSalaryDrawing(salaryDrawing, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "deleteSalaryDrawing", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteSalesPicture() throws FLException {

		salaryDrawingService.deleteSalaryDrawing(salaryDrawing);

		return SUCCESS;
	}

	public SalaryDrawingVO getSalaryDrawing() {
		return salaryDrawing;
	}

	public void setSalaryDrawing(SalaryDrawingVO salaryDrawing) {
		this.salaryDrawing = salaryDrawing;
	}

	public List<SalaryDrawingVO> getSalaryDrawings() {
		return salaryDrawings;
	}

	public void setSalaryDrawings(List<SalaryDrawingVO> salaryDrawings) {
		this.salaryDrawings = salaryDrawings;
	}

}
