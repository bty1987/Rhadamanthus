package com.fanglin.data.quotation.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.quotation.vo.NormaddVO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.utils.Paging;

public interface NormaddService {
	
	public void pageNormadd(Paging paging, List<Filter> filters, int company);
	
	public List<NormaddVO> queryNormadd(NormaddVO normaddVO, DecorationVO decorationVO, int company) throws FLException;
	
	public int addNormadd(NormaddVO normaddVO, int company);

	public int updateNormadd(NormaddVO normaddVO);

	public int updateNormaddForStatus(NormaddVO normaddVO);
	
	public int deleteNormadd(NormaddVO normaddVO);
	
}
