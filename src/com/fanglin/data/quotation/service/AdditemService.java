package com.fanglin.data.quotation.service;

import java.util.List;

import com.fanglin.core.vo.Filter;
import com.fanglin.data.quotation.vo.AdditemVO;
import com.fanglin.utils.Paging;

public interface AdditemService {
	
	public void pageAdditem(Paging paging, List<Filter> filters, int company);
	
	public List<AdditemVO> queryAdditem(AdditemVO additemVO, int company);
	
	public int addAdditem(AdditemVO additemVO, int company);
	
	public int updateAdditemForStatus(AdditemVO additemVO);
	
	public int deleteAdditem(AdditemVO additemVO);
	
}
