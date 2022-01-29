package com.fanglin.data.quotation.service;

import java.util.List;

import com.fanglin.core.vo.Filter;
import com.fanglin.data.quotation.vo.PackitemVO;
import com.fanglin.utils.Paging;

public interface PackitemService {
	
	public void pagePackitem(Paging paging, List<Filter> filters);
	
	public List<PackitemVO> queryPackitem(PackitemVO packitemVO);
	
	public int addPackitem(PackitemVO packitemVO);
	
	public int updatePackitemForStatus(PackitemVO packitemVO);
	
	public int deletePackitem(PackitemVO packitemVO);
	
}
