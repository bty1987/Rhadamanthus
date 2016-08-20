/**
 * @File Name		: CategoryAction.java
 * @Package   	: com.fanglin.data.action
 * @Version		: 1.0
 * @Date			: 2015-11-29
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.common.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.data.common.service.CategoryService;
import com.fanglin.data.common.vo.CategoryVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class CategoryAction extends BaseListAction {

	private static final long serialVersionUID = 5715274416352730557L;
	
	@Autowired
	private CategoryService categoryService;
	
	private CategoryVO category;
	
	private List<CategoryVO> categorys;
	
	private List<Long> cIds;
	
	@Action(value="pageCategory", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageCategory(){
		
		categoryService.pageCategory(getPaging(), getFilters());
		
		return SUCCESS;
	}
	
	@Action(value="queryCategory", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryCategory(){
		
		categorys = categoryService.queryCategory();
		
		return SUCCESS;
	}
	
	@Action(value="queryCategoryByCId", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryCategoryByCId(){
		
		category = categoryService.queryCategoryByCId(category);
		
		return SUCCESS;
	}
	
	@Action(value="addCategory", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String addCategory(){
		
		categoryService.addCategory(category);
		
		return SUCCESS;
	}
	
	@Action(value="updateCategory", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updateCategory(){
		
		categoryService.updateCategory(category);
		
		return SUCCESS;
	}
	
	@Action(value="deleteCategoryByCIds", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String deleteCategoryByCIds(){
		
		categoryService.deleteCategoryByCIds(cIds);
		
		return SUCCESS;
	}

	public CategoryVO getCategory() {
		return category;
	}

	public void setCategory(CategoryVO category) {
		this.category = category;
	}

	public List<CategoryVO> getCategorys() {
		return categorys;
	}

	public void setCategorys(List<CategoryVO> categorys) {
		this.categorys = categorys;
	}

	public List<Long> getcIds() {
		return cIds;
	}

	public void setcIds(List<Long> cIds) {
		this.cIds = cIds;
	}

}
