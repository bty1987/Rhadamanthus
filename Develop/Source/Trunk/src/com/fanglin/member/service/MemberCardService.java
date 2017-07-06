package com.fanglin.member.service;

import java.util.List;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.member.vo.MemberCardVO;
import com.fanglin.member.vo.MemberDetailVO;
import com.fanglin.utils.Paging;

public interface MemberCardService {
	
	public void pageMemberCard(Paging paging, List<Filter> filters);

	public MemberCardVO queryMemberCardByOrderId(MemberCardVO memberCardVO);
	
	public int addMemberCard(MemberCardVO memberCardVO) throws FLException;
	
	public int updateMemberCard(MemberCardVO memberCardVO) throws FLException;
	
	public int turnPointsForMemberCard(MemberCardVO outMemberCardVO,MemberCardVO inMemberCardVO,MemberDetailVO memberDetailVO,String userId) throws FLException;
	
}
