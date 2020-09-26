package com.fanglin.store.service;

import java.util.List;

import com.fanglin.core.vo.Filter;
import com.fanglin.store.vo.MuserVO;
import com.fanglin.utils.Paging;

public interface MuserService {

	public void pageMuser(Paging paging, List<Filter> filters);

	public MuserVO queryMuserByUnionId(MuserVO muser);

	public int saveMuser(MuserVO muser);

}
