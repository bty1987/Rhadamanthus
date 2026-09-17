package com.fanglin.communion.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.communion.service.CategoryFormatService;
import com.fanglin.communion.vo.CategoryFormatVO;
import com.fanglin.core.action.BaseAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class CategoryFormatAction extends BaseAction {

	private static final long serialVersionUID = -3926773019286137402L;

	@Autowired
	private CategoryFormatService categoryFormatService;

	private CategoryFormatVO categoryFormat;

	private List<CategoryFormatVO> categoryFormats;

	@Action(value = "queryCategoryFormatByCid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCategoryFormatByCid() throws FLException {

		categoryFormats = categoryFormatService.queryCategoryFormatByCid(categoryFormat);

		return SUCCESS;
	}

	@Action(value = "addCategoryFormat", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addCategoryFormat() throws FLException {

		categoryFormatService.addCategoryFormat(categoryFormat);

		return SUCCESS;
	}

	@Action(value = "updateCategoryFormat", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateCategoryFormat() throws FLException {

		categoryFormatService.updateCategoryFormat(categoryFormat);

		return SUCCESS;
	}

	@Action(value = "deleteCategoryFormat", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteCategoryFormat() throws FLException {

		categoryFormatService.deleteCategoryFormat(categoryFormat);

		return SUCCESS;
	}

	public CategoryFormatVO getCategoryFormat() {
		return categoryFormat;
	}

	public void setCategoryFormat(CategoryFormatVO categoryFormat) {
		this.categoryFormat = categoryFormat;
	}

	public List<CategoryFormatVO> getCategoryFormats() {
		return categoryFormats;
	}

	public void setCategoryFormats(List<CategoryFormatVO> categoryFormats) {
		this.categoryFormats = categoryFormats;
	}

}
