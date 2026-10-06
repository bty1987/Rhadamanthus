package com.fanglin.data.quotation.service;

import java.util.List;

import com.fanglin.core.vo.Filter;
import com.fanglin.data.quotation.vo.CormtimeVO;
import com.fanglin.utils.Paging;

public interface CormtimeService {

	public void pageCormtime(Paging paging, List<Filter> filters);

	public List<CormtimeVO> queryCormtimeByQfid(Long qfid);

	public int addCormtime(CormtimeVO cormtimeVO);

	public int deleteCormtime(CormtimeVO cormtimeVO);

}
