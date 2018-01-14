package com.fanglin.information.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.information.po.MemberDetailPO;
import com.fanglin.utils.Paging;

public interface MemberDetailDao  extends Dao<MemberDetailPO> {

	public List<MemberDetailPO> queryMemberDetailByMcId(long mcId);
	
	public List<MemberDetailPO> queryMemberDetailByMcIdForSubType(long mcId);
	
	public List<MemberDetailPO> pageMemberDetail(Paging paging, List<Filter> filters);
	
}
