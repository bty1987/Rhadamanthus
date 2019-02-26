package com.fanglin.personel.dao;
import java.util.List;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.po.PerformancePO;
import com.fanglin.utils.Paging;

public interface PerformanceDao extends Dao<PerformancePO>{
	
	public List<PerformancePO> pagePerformance (Paging paging, List<Filter> filters);

}
