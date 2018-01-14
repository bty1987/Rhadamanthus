package com.fanglin.salary.service;

import java.util.List;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.salary.vo.DesignerSalaryVO;
import com.fanglin.utils.Paging;

public interface DesignerSalaryService {
	
	public void  pagedesignerSalary(Paging paging ,List<Filter> filter);
	
	public void adddesignerSalary(DesignerSalaryVO designerSalaryVO,String userId)throws FLException;

	public int updatedesignerSalary(DesignerSalaryVO designerSalaryVO)throws FLException ;

	public int adoptdesignerSalary(List<DesignerSalaryVO> designerSalarys,String userId) throws FLException;
	
	public int rejectdesignerSalary(List<DesignerSalaryVO> designerSalarys,String userId) throws FLException;
	
	public  void deletedesignerSalary(DesignerSalaryVO designerSalarVO) throws FLException;
	
	

}
