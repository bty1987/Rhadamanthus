package com.fanglin.data.quotation.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.quotation.vo.CormoodVO;
import com.fanglin.utils.Paging;

public interface CormoodService {

	public void pageCormood(Paging paging, List<Filter> filters);

	public List<CormoodVO> queryCormoodByQfid(Long qfid);

	public int addCormood(CormoodVO cormoodVO) throws FLException;

	public int deleteCormood(CormoodVO cormoodVO);

}
