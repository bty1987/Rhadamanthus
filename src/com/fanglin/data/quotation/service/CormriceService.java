package com.fanglin.data.quotation.service;

import java.util.List;

import com.fanglin.core.vo.Filter;
import com.fanglin.data.quotation.vo.CormriceVO;
import com.fanglin.utils.Paging;

public interface CormriceService {

	public void pageCormrice(Paging paging, List<Filter> filters, Integer company);

	public List<CormriceVO> queryCormriceByQcid(Long qcid);

	public List<CormriceVO> queryCormriceByQfid(Long qfid);

	public int addCormrice(CormriceVO cormriceVO);

	public int deleteCormrice(CormriceVO cormriceVO);

}
