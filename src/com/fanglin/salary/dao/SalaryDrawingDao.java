package com.fanglin.salary.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.salary.po.SalaryDrawingPO;

public interface SalaryDrawingDao extends Dao<SalaryDrawingPO> {

	public List<SalaryDrawingPO> querySalaryDrawing(Long sid, Short type);

	public int countSalaryDrawing(Long sid, Short type);

}
