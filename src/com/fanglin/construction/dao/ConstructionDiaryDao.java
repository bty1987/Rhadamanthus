package com.fanglin.construction.dao;

import java.util.List;
import com.fanglin.construction.po.ConstructionDiaryPO;
import com.fanglin.construction.vo.ConstructionDiaryVO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface ConstructionDiaryDao extends Dao<ConstructionDiaryPO> {

	public List<ConstructionDiaryPO> pageConstructionDiary(Paging paging, List<Filter> filters, Integer company) throws FLException;

	public List<ConstructionDiaryPO> queryConstructionDiary(ConstructionDiaryVO constructionDiaryVO) throws FLException;

}
