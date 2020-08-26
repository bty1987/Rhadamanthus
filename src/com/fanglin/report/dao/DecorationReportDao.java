package com.fanglin.report.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.report.po.DecorationReportPO;
import com.fanglin.utils.Paging;

public interface DecorationReportDao extends Dao<DecorationReportPO>{

	public List<DecorationReportPO> queryDecoration7Construction(Paging paging, List<Filter> list);
	
	public List<Object[]> countDecorationForConstruction();
	
	public List<Object[]> countDecorationForContract(List<Integer> year);
	
	public List<Object[]> countDecorationForPaySacle(int min, Integer max,Integer type);

	public List<Object[]> countDecorationForDesignStatus(List<Short> designStatus);

	public List<Object[]> countDecorationForDeposit(short deposit);
	
	public void truncateDecoration7Construction();

}
