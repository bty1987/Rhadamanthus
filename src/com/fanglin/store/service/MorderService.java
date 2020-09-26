package com.fanglin.store.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.store.vo.MorderItemVO;
import com.fanglin.store.vo.MorderVO;
import com.fanglin.utils.Paging;

public interface MorderService {

	public void pageMorder(Paging paging, List<Filter> filters, Boolean flag);

	public int addMorder(MorderVO morderVO, List<MorderItemVO> morderItemVOs, List<Long> cids) throws FLException;

	public int updateMorderForStatus(MorderVO morderVO) throws FLException;

	public int deleteMorder(MorderVO morderVO) throws FLException;

}
