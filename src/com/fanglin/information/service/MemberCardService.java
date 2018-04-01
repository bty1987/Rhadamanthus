package com.fanglin.information.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.information.vo.MemberCardVO;
import com.fanglin.information.vo.MemberDetailVO;
import com.fanglin.material.po.MaterialPO;
import com.fanglin.payment.po.MaterialPaymentPO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.Paging;

public interface MemberCardService {
	
	public void pageMemberCard(Paging paging, List<Filter> filters);

	public MemberCardVO queryMemberCardByOrderId(MemberCardVO memberCardVO);
	
	public int addMemberCard(MemberCardVO memberCardVO) throws FLException;
	
	public int updateMemberCard(MemberCardVO memberCardVO) throws FLException;
	
	public int tranMemberCard(MemberCardVO outMemberCardVO,MemberCardVO inMemberCardVO,MemberDetailVO memberDetailVO,String userId) throws FLException;
	
	public int IncreaseMemberCardIntegraldivider(MaterialPO materialPO,MaterialPaymentPO materialPaymentPO,UserPO userPO) throws FLException;
	
	public int MinusMemberCardIntegraldivider(MaterialPO materialPO,MaterialPaymentPO materialPaymentPO,UserPO userPO) throws FLException;
	
}
