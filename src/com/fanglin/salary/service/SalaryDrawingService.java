package com.fanglin.salary.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.salary.vo.SalaryDrawingVO;

public interface SalaryDrawingService {

	public List<SalaryDrawingVO> querySalaryDrawing(SalaryDrawingVO salaryDrawingVO);

	public void addSalaryDrawing(SalaryDrawingVO salaryDrawingVO, String userId, int company) throws FLException;

	public void deleteSalaryDrawing(SalaryDrawingVO salaryDrawingVO) throws FLException;

}
