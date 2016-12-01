/*
 * @File Name	: BaseListAction.java
 * @Package		：com.fanglin.action 
 * @Version		: 1.0
 * @Date		: 2014-7-7
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email		: 
 * Describing	: 基类Action 当返回的是非列表的Action是继承BaseAction类，返回列表时继承BaseListAction类
 */

package com.fanglin.core.action;

import java.util.ArrayList;
import java.util.List;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public class BaseListAction extends BaseAction {

	private static final long serialVersionUID = 8821805938013339716L;
	
	private Paging paging;
	
	private List<Filter> filters = new ArrayList<Filter>();
	
	private String condition;
	
	public Paging getPaging(){
		return paging;
	}

	public void setPaging(Paging paging){
		this.paging = paging;
	}

	@JSON(serialize = false)
	public List<Filter> getFilters(){
		return filters;
	}

	public void setFilters(List<Filter> filters){
		this.filters = filters;
	}

	public String getCondition() {
		return condition;
	}

	public void setCondition(String condition) {
		this.condition = condition;
	}
	
}
