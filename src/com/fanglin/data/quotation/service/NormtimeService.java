package com.fanglin.data.quotation.service;

import java.util.List;

import com.fanglin.core.vo.Filter;
import com.fanglin.data.quotation.vo.NormtimeVO;
import com.fanglin.utils.Paging;

public interface NormtimeService {

	public void pageNormtime(Paging paging, List<Filter> filters);

	public List<NormtimeVO> queryNormtimeByQiid(Long qiid);

	public int addNormtime(NormtimeVO normtimeVO);

	public int deleteNormtime(NormtimeVO normtimeVO);

}
