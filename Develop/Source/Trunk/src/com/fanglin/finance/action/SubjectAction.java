/**
 * @File Name		: SubjectAction.java
 * @Package   	: com.fanglin.finance.action
 * @Version		: 1.0
 * @Date			: 2015-12-24
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.finance.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.finance.service.SubjectService;
import com.fanglin.finance.vo.SubjectVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class SubjectAction extends BaseListAction {

	private static final long serialVersionUID = 653193647500095223L;
	
	@Autowired
	private SubjectService subjectService;
	
	private SubjectVO subject;
	
	private List<SubjectVO> subjects;
	
	@Action(value = "pageSubject", results = { @Result(name = "success", type = "json" , params={"ignoreHierarchy","false"}) } )
	public String pageSubject(){
		
		subjectService.pageSubject(getPaging(), getFilters());
		
		return SUCCESS;
	}
	
	@Action(value = "querySubject", results = { @Result(name = "success", type = "json" , params={"ignoreHierarchy","false"}) } )
	public String querySubject(){
		
		subjects = subjectService.querySubject();
		
		return SUCCESS;
	}
	
	@Action(value = "querySubjectByNameOCode", results = { @Result(name = "success", type = "json" , params={"ignoreHierarchy","false"}) } )
	public String querySubjectByNameOCode(){
		
		subjects = subjectService.querySubjectByNameOCode(subject);
		
		return SUCCESS;
	}
	
	@Action(value = "querySubjectByCode", results = { @Result(name = "success", type = "json" , params={"ignoreHierarchy","false"}) } )
	public String querySubjectByCode() throws FLException{
		
		subject = subjectService.querySubjectByCode(subject);
		
		return SUCCESS;
	}
	
	@Action(value = "addSubject", results = { @Result(name = "success", type = "json" , params={"ignoreHierarchy","false"}) } )
	public String addSubject() throws FLException{
		
		subjectService.addSubject(subject);
		
		return SUCCESS;
	}
	
	@Action(value = "updateSubject", results = { @Result(name = "success", type = "json" , params={"ignoreHierarchy","false"}) } )
	public String updateSubject() throws FLException{
		
		subjectService.updateSubject(subject);
		
		return SUCCESS;
	}
	
	@Action(value = "updateSubjectForStatus", results = { @Result(name = "success", type = "json" , params={"ignoreHierarchy","false"}) } )
	public String updateSubjectForStatus() throws FLException{
		
		subjectService.updateSubjectForStatus(subject);
		
		return SUCCESS;
	}
	
	@Action(value = "deleteSubject", results = { @Result(name = "success", type = "json" , params={"ignoreHierarchy","false"}) } )
	public String deleteSubject() throws FLException{
		
		subjectService.deleteSubject(subject);
		
		return SUCCESS;
	}

	public SubjectVO getSubject() {
		return subject;
	}

	public void setSubject(SubjectVO subject) {
		this.subject = subject;
	}

	public List<SubjectVO> getSubjects() {
		return subjects;
	}

	public void setSubjects(List<SubjectVO> subjects) {
		this.subjects = subjects;
	}
	
}
