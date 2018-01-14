/**
 * @File Name		: WorkTypeAction.java
 * @Package   	: com.fanglin.action
 * @Version		: 1.0
 * @Date			: 2014-7-29
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
import com.fanglin.data.common.service.WorkTypeService;
import com.fanglin.data.common.vo.WorkTypeVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class WorkTypeAction extends BaseListAction {

	private static final long serialVersionUID = 1651273403349675468L;
	
	@Autowired
	private WorkTypeService workTypeService;
	
	private List<WorkTypeVO> workTypes;
	
	@Action(value="queryWorkType", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryWorkType(){
		
		workTypes = workTypeService.queryWorkType();
		
		return SUCCESS;
	}

	public List<WorkTypeVO> getWorkTypes(){
		return workTypes;
	}

	public void setWorkTypes(List<WorkTypeVO> workTypes){
		this.workTypes = workTypes;
	}
	
}
