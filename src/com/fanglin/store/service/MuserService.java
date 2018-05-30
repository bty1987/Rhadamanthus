package com.fanglin.store.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.store.vo.MuserVO;
import com.fanglin.utils.Paging;

public interface MuserService {

	public void pageMuser(Paging paging, List<Filter> filters);
	
	public List<MuserVO> queryMuserByPinyinName(String pinyinName);

	public MuserVO queryMuserByUid(MuserVO muser);
	
	public MuserVO queryMuserByUnion(MuserVO muser);

	public void addMuser(MuserVO muser) throws FLException;

	public void updateMuser(MuserVO muser) throws FLException;

}
