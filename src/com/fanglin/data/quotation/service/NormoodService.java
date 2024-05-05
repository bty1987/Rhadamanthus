package com.fanglin.data.quotation.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.quotation.vo.NormoodVO;
import com.fanglin.utils.Paging;

public interface NormoodService {

	public void pageNormood(Paging paging, List<Filter> filters);

	public List<NormoodVO> queryNormoodByQiid(Long qiid);

	public int addNormood(NormoodVO normoodVO) throws FLException;

	public int deleteNormood(NormoodVO normoodVO);
}
