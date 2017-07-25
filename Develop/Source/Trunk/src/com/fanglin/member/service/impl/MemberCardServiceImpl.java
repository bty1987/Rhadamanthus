package com.fanglin.member.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.fanglin.common.po.CountingPO;
import com.fanglin.common.service.CountingService;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.member.dao.MemberCardDao;
import com.fanglin.member.dao.MemberDetailDao;
import com.fanglin.member.po.MemberCardPO;
import com.fanglin.member.po.MemberDetailPO;
import com.fanglin.member.service.MemberCardService;
import com.fanglin.member.vo.MemberCardVO;
import com.fanglin.member.vo.MemberDetailVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;

@Service("memberCardService")
@Transactional(readOnly = true)
public class MemberCardServiceImpl  implements MemberCardService {

	@Autowired
	private MemberCardDao memberCardDao;
	
	@Autowired
	private CountingService countingService;
	
	@Autowired
	private MemberDetailDao memberDetailDao; 
	
	@Autowired
	private UserDao userDao;
	
	@Override
	public void pageMemberCard(Paging paging, List<Filter> filters) {
		
		List<MemberCardPO> memberCardPOs = memberCardDao.pageMemberCard(paging, filters);
		List<MemberCardVO> memberCardVOs = new ArrayList<MemberCardVO>();
		
		MemberCardVO memberCardVO;
		
		for(MemberCardPO memberCardPO: memberCardPOs){
			memberCardVO = new MemberCardVO();
			BeanUtil.copyProperties(memberCardPO, memberCardVO);
			
			memberCardVOs.add(memberCardVO);
		}
		
		paging.setData(memberCardVOs);
	}

	@Override
	public MemberCardVO queryMemberCardByOrderId(MemberCardVO memberCardVO){

		MemberCardPO memberCardPO = memberCardDao.queryMemberCardByOrderId(memberCardVO.getOrderId());

		BeanUtil.copyProperties(memberCardPO, memberCardVO);

		return memberCardVO;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addMemberCard(MemberCardVO memberCardVO) throws FLException{
		
		MemberCardPO memberCard = memberCardDao.queryMemberCardByOrderId(memberCardVO.getOrderId());
		
		if(memberCard != null){
			throw new FLException(290001, "会员卡已存在");
		}

		MemberCardPO memberCardPO = new MemberCardPO();

		BeanUtil.copyProperties(memberCardVO, memberCardPO);
		//VIP作为编号前缀 , 之后由8位数字组成
		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_INVENTORY_PO_INT,"yyyyMMdd");
		String memberNo = String.valueOf("VIP") + FormatUtil.fillZero(count, "00000000");
		memberCardPO.setNo(memberNo);
		memberCardPO.setCredits(MemberCardPO.COLUMN_CREDITS_INT); 
		memberCardPO.setCreateTime(new Timestamp(System.currentTimeMillis()));

		memberCardDao.save(memberCardPO);

		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateMemberCard(MemberCardVO memberCardVO) throws FLException{
		
		MemberCardPO memberCard = memberCardDao.queryMemberCardByOrderId(memberCardVO.getOrderId());
		
		if(memberCard == null){
			throw new FLException(290002, "会员卡不存在");
		}
		
		MemberCardPO memberCardPO = new MemberCardPO();

		BeanUtil.copyProperties(memberCardVO, memberCardPO);
		
		memberCardDao.update(memberCardPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int turnPointsForMemberCard(MemberCardVO outMemberCardVO,MemberCardVO inMemberCardVO,MemberDetailVO menberDetailVO,String userId) throws FLException {
		
		MemberCardPO outMemberCardPO = memberCardDao.queryMemberCardByNo(outMemberCardVO.getNo());
		MemberCardPO inMemberCardPO = memberCardDao.queryMemberCardByNo(inMemberCardVO.getNo());
		UserPO userPO = userDao.queryUserByUserId(userId);
		
		if(outMemberCardPO == null){
			throw new FLException(290002, "会员卡不存在");
		}
		if(inMemberCardPO == null){
			throw new FLException(290002, "会员卡不存在");
		}
		
		MemberDetailPO outMemberDetailPO = new MemberDetailPO();
		outMemberDetailPO.setMemberCard(outMemberCardPO);
		outMemberDetailPO.setCuId(userPO);
		outMemberDetailPO.setType(MemberDetailPO.COLUMN_TURNPOINTSTYPE);
		Timestamp outnowTime = new Timestamp(System.currentTimeMillis());
		outMemberDetailPO.setCreateTime(outnowTime.getTime());
		outMemberDetailPO.setCredit(-menberDetailVO.getCredit());
		outMemberDetailPO.setBalance(MemberDetailPO.COLUMN_ZERO_INT);
		outMemberDetailPO.setMultiple(MemberDetailPO.COLUMN_SUBTYPELESS_SHORT);
		outMemberDetailPO.setSubType(MemberDetailPO.COLUMN_SUBTYPELESS_SHORT);
		outMemberDetailPO.setDivider(MemberDetailPO.COLUMN_ZERO_INT);
		outMemberDetailPO.setPid(inMemberCardPO.getMcId());
		memberDetailDao.save(outMemberDetailPO);
		
		MemberDetailPO inMemberDetailPO = new MemberDetailPO();
		inMemberDetailPO.setMemberCard(inMemberCardPO);
		inMemberDetailPO.setCuId(userPO);
		inMemberDetailPO.setType(MemberDetailPO.COLUMN_TURNPOINTSTYPE);
		Timestamp innowTime = new Timestamp(System.currentTimeMillis());
		inMemberDetailPO.setCreateTime(innowTime.getTime());
		inMemberDetailPO.setCredit(menberDetailVO.getCredit());
		inMemberDetailPO.setBalance(MemberDetailPO.COLUMN_ZERO_INT);
		inMemberDetailPO.setMultiple(MemberDetailPO.COLUMN_SUBTYPELESS_SHORT);
		inMemberDetailPO.setSubType(MemberDetailPO.COLUMN_SUBTYPEPLUS_SHORT);
		inMemberDetailPO.setDivider(MemberDetailPO.COLUMN_ZERO_INT);
		inMemberDetailPO.setPid(outMemberCardPO.getMcId());
		memberDetailDao.save(inMemberDetailPO);
		
		outMemberCardPO.setCredits(outMemberCardPO.getCredits()-menberDetailVO.getCredit());
		
		memberCardDao.update(outMemberCardPO);
		
		inMemberCardPO.setCredits(inMemberCardPO.getCredits()+menberDetailVO.getCredit());
		
		memberCardDao.update(inMemberCardPO);
		
		return 0;
	}

}
