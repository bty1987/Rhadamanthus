package com.fanglin.data.quotation.service;

import java.util.List;

import com.fanglin.core.vo.Filter;
import com.fanglin.data.quotation.vo.NormpackVO;
import com.fanglin.utils.Paging;

public interface NormpackService {

	public void pageNormpack(Paging paging, List<Filter> filters, int company);

	public List<NormpackVO> queryNormpack(NormpackVO normpackVO, int company);

	public int addNormpack(NormpackVO normpackVO, int company);

	public int updateNormpackForStatus(NormpackVO normpackVO);

	public int deleteNormpack(NormpackVO normpackVO);

}
