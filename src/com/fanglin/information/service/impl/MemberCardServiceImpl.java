package com.fanglin.information.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.common.po.CountingPO;
import com.fanglin.common.service.CountingService;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.information.dao.MemberCardDao;
import com.fanglin.information.dao.MemberDetailDao;
import com.fanglin.information.po.MemberCardPO;
import com.fanglin.information.po.MemberDetailPO;
import com.fanglin.information.service.MemberCardService;
import com.fanglin.information.vo.MemberCardVO;
import com.fanglin.information.vo.MemberDetailVO;
import com.fanglin.material.po.MaterialPO;
import com.fanglin.payment.po.MaterialPaymentPO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
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
	
	@Autowired
	private SystemConfigDao systemConfigDao;
	
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
		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_INVENTORY_PO_INT,"yyyyMMdd", 0);
		String memberNo = String.valueOf("VIP") + FormatUtil.fillZero(count, "00000000");
		memberCardPO.setNo(memberNo);
		memberCardPO.setCredits(MemberCardPO.CREDITS_INIT_INT); 
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
	public int tranMemberCard(MemberCardVO outMemberCardVO,MemberCardVO inMemberCardVO,MemberDetailVO menberDetailVO,String userId) throws FLException {
		
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
		outMemberDetailPO.setType(MemberDetailPO.SUBTYPE_TURNPOINTSTYPE_INT);
		Timestamp outnowTime = new Timestamp(System.currentTimeMillis());
		outMemberDetailPO.setCreateTime(outnowTime.getTime());
		outMemberDetailPO.setCredit(-menberDetailVO.getCredit());
		outMemberDetailPO.setBalance(MemberDetailPO.BALANCE_ZERO_INT);
		outMemberDetailPO.setMultiple(MemberDetailPO.SUBTYPE_LESS_INT);
		outMemberDetailPO.setSubType(MemberDetailPO.SUBTYPE_LESS_INT);
		outMemberDetailPO.setDivider(MemberDetailPO.BALANCE_ZERO_INT);
		outMemberDetailPO.setPid(inMemberCardPO.getMcId());
		memberDetailDao.save(outMemberDetailPO);
		
		MemberDetailPO inMemberDetailPO = new MemberDetailPO();
		inMemberDetailPO.setMemberCard(inMemberCardPO);
		inMemberDetailPO.setCuId(userPO);
		inMemberDetailPO.setType(MemberDetailPO.SUBTYPE_TURNPOINTSTYPE_INT);
		Timestamp innowTime = new Timestamp(System.currentTimeMillis());
		inMemberDetailPO.setCreateTime(innowTime.getTime());
		inMemberDetailPO.setCredit(menberDetailVO.getCredit());
		inMemberDetailPO.setBalance(MemberDetailPO.BALANCE_ZERO_INT);
		inMemberDetailPO.setMultiple(MemberDetailPO.SUBTYPE_LESS_INT);
		inMemberDetailPO.setSubType(MemberDetailPO.SUBTYPE_PLUS_INT);
		inMemberDetailPO.setDivider(MemberDetailPO.BALANCE_ZERO_INT);
		inMemberDetailPO.setPid(outMemberCardPO.getMcId());
		memberDetailDao.save(inMemberDetailPO);
		
		outMemberCardPO.setCredits(outMemberCardPO.getCredits()-menberDetailVO.getCredit());
		
		memberCardDao.update(outMemberCardPO);
		
		inMemberCardPO.setCredits(inMemberCardPO.getCredits()+menberDetailVO.getCredit());
		
		memberCardDao.update(inMemberCardPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int IncreaseMemberCardIntegraldivider(MaterialPO materialPO,MaterialPaymentPO materialPaymentPO,UserPO userPO) throws FLException {
		
		MemberCardPO memberCard = memberCardDao.queryMemberCardByOrderId(materialPO.getOrderId());
		
		if(memberCard != null){
			//integraldivider  积分比例       integralmultiple  积分倍数
			int integraldivider = Integer.valueOf(systemConfigDao.querySystemConfig("integraldivider").getValue());
			int integralmultiple = Integer.valueOf(systemConfigDao.querySystemConfig("integralmultiple").getValue());
			
			memberCard.setCredits(memberCard.getCredits() + materialPaymentPO.getReferMoney()/integraldivider*integralmultiple);
			
			MemberDetailPO memberDetailPO = new MemberDetailPO();
			memberDetailPO.setMemberCard(memberCard);
			memberDetailPO.setPid(materialPaymentPO.getMpId());
			memberDetailPO.setType(MemberDetailPO.SUBTYPE_LESS_INT);
			memberDetailPO.setSubType(MemberDetailPO.SUBTYPE_PLUS_INT);
			memberDetailPO.setCredit(materialPaymentPO.getReferMoney()/integraldivider*integralmultiple);
			memberDetailPO.setBalance(materialPaymentPO.getReferMoney()/integraldivider*integralmultiple);
			memberDetailPO.setMultiple(integralmultiple);
			memberDetailPO.setDivider(integraldivider);
			memberDetailPO.setCuId(userPO);
			memberDetailPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()).getTime());
			memberDetailPO.setComment("主材收款");
			
			memberDetailDao.save(memberDetailPO);
			memberCardDao.update(memberCard);
		}
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int MinusMemberCardIntegraldivider(MaterialPO materialPO,MaterialPaymentPO materialPaymentPO,UserPO userPO) throws FLException {
		
		MemberCardPO memberCard = memberCardDao.queryMemberCardByOrderId(materialPO.getOrderId());
		float refundMoney = materialPaymentPO.getReferMoney();
		float refundIntegral = 0f;
		if(memberCard != null){
			
			List<MemberDetailPO> memberDetailPOs = memberDetailDao.queryMemberDetailByMcIdForSubType(memberCard.getMcId());
			
			if(memberDetailPOs != null){
				
				for(MemberDetailPO memberDetail:memberDetailPOs){
					
					if(memberDetail.getBalance()!=0){
						
						if(memberDetail.getBalance()/memberDetail.getMultiple()*memberDetail.getDivider() < refundMoney){
							refundMoney = refundMoney - memberDetail.getBalance()/memberDetail.getMultiple()*memberDetail.getDivider();
							refundIntegral = Arith.add(refundIntegral, memberDetail.getBalance());
							memberDetail.setBalance(MemberDetailPO.BALANCE_ZERO_INT);
							memberDetailDao.update(memberDetail);
						}else{							
							float _balance = memberDetail.getBalance()-refundMoney/memberDetail.getDivider()*memberDetail.getMultiple();
							
							if(_balance<0){
								_balance = 0;
							}
							
							refundIntegral = refundIntegral+refundMoney/memberDetail.getDivider()*memberDetail.getMultiple();
							memberDetail.setBalance(_balance);
							memberDetailDao.update(memberDetail);
							
							MemberDetailPO memberDetailPO = new MemberDetailPO();
							float refund = memberCard.getCredits()-refundIntegral;
							memberDetailPO.setMemberCard(memberCard);
							memberDetailPO.setPid(materialPaymentPO.getMpId());
							memberDetailPO.setType(MemberDetailPO.SUBTYPE_LESS_INT);
							memberDetailPO.setSubType(MemberDetailPO.SUBTYPE_LESS_INT);
							memberDetailPO.setCredit(-refundIntegral);
							memberDetailPO.setBalance(MemberDetailPO.BALANCE_ZERO_INT);
							memberDetailPO.setMultiple(1);
							memberDetailPO.setDivider(0);
							memberDetailPO.setCuId(userPO);
							memberDetailPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()).getTime());
							memberDetailPO.setComment("主材退款");
							memberDetailDao.save(memberDetailPO);
							
							memberCard.setCredits(refund);
							memberCardDao.update(memberCard);
							
							break;
						}
					}
				}
			}
		}
		
		return 0;
	}

}
