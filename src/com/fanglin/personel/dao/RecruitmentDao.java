package com.fanglin.personel.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.po.RecruitmentPO;
import com.fanglin.utils.Paging;


public interface RecruitmentDao extends Dao<RecruitmentPO>{
	
	public List<RecruitmentPO>pageRecruitment(Paging paging, List<Filter> filters);
	
	public RecruitmentPO queryRecruitmentByRid(long rid);
	
}
