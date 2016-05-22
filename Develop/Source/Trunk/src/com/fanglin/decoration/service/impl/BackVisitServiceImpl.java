/**
 * @File Name		: BackVisitServiceImpl
 * @Package   	: com.fanglin.service.impl
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: mzy
 * @Email			: 739061411@qqcom
 * @Describing	: 
 */

package com.fanglin.decoration.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.decoration.dao.BackVisitDao;
import com.fanglin.decoration.dao.DecorationOrderDao;
import com.fanglin.decoration.po.BackVisitPO;
import com.fanglin.decoration.po.DecorationOrderPO;
import com.fanglin.decoration.service.BackVisitService;
import com.fanglin.decoration.vo.BackVisitVO;
import com.fanglin.information.po.MessagePO;
import com.fanglin.information.service.MessageService;
import com.fanglin.information.vo.MessageVO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.service.UserService;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;
import com.fanglin.utils.SystemConfig;

@Service("backVisitService")
@Transactional(readOnly=true)
public class BackVisitServiceImpl implements BackVisitService {

	@Autowired
	private BackVisitDao backVisitDao;
	
	@Autowired
	private DecorationOrderDao  decorationOrderDao;
	
	@Autowired
	private MessageService messageService;
	
	@Autowired
	private UserService userService;
	
	@Override
	public void pageBackVisitByOrderId(Paging paging, List<FilterVO> filters, BackVisitVO backVisitVO){
		
		List<BackVisitVO> backVisitVOs = new ArrayList<BackVisitVO>();
		List<BackVisitPO> backVisitPOs = backVisitDao.pageBackVisitByOrderId(paging, filters, backVisitVO.getOrderId());
		
		for(BackVisitPO backVisitPO: backVisitPOs){
			BackVisitVO _backVisitVO = new BackVisitVO();
			BeanUtil.copyProperties(backVisitPO, _backVisitVO);
			
			_backVisitVO.setDesigner(backVisitPO.getDesignerPO().getCurrentName());
			_backVisitVO.setDesignerId(backVisitPO.getDesignerPO().getUserId());
			_backVisitVO.setOrderId(backVisitPO.getDecorationOrderPO().getOrderId());
			
			backVisitVOs.add(_backVisitVO);
		}
		
		paging.setData(backVisitVOs);
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void remindBackVisitForDesigner() throws FLException{
		
		Date now  = new Date();
		int backVisitDate = SystemConfig.getInt("backVisitDate", 5) * 24 * 60 * 60 * 1000;
		int backVisitStage = SystemConfig.getInt("backVisitStage", 3);
		Long startTime = now.getTime() - backVisitStage * backVisitDate ;
		
		List<FilterVO> filters = new ArrayList<FilterVO>();
		filters.add(new FilterVO("createTime", startTime.toString(), "gt"));
		
		List<DecorationOrderPO> decorationOrderPOs = decorationOrderDao.queryDecorationOrderForBackVisit(filters);
		
		for(DecorationOrderPO decorationOrderPO: decorationOrderPOs){
			
			StringBuffer contents = null;
			
			long createTime = decorationOrderPO.getCreateTime().getTime();
			long keepTime = now.getTime() - createTime;
			
			long stage = keepTime / backVisitDate;
			
			Timestamp start = new Timestamp(createTime + stage * backVisitStage);
			Timestamp end =  new Timestamp(createTime + (stage+1) * backVisitStage);
			
			List<BackVisitPO> backVisitPOs = backVisitDao.queryBackVisitByOrderIdAStartAEndTime(decorationOrderPO.getOrderId(), start, end);
			
			if(backVisitPOs == null || backVisitPOs.size() == 0){
				//发送消息提醒设计师及对应设计部长
				
				contents = new StringBuffer();
				contents.append("订单:");
				contents.append(decorationOrderPO.getOrderId());
				contents.append("回访提醒!");
				
				MessageVO message = new MessageVO();
				message.setSender(new UserVO(UserPO.SUPER_USERID_STR)); // root
				message.setReceiver(new UserVO(decorationOrderPO.getDesignerPO().getUserId()));
				message.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
				message.setType(MessagePO.MESSAGE_TYPE_BACKVISIT_STR);
				message.setContents(contents.toString());
				messageService.sendMessage(message);
				
				contents = new StringBuffer();
				contents.append("订单:");
				contents.append(decorationOrderPO.getOrderId());
				contents.append("设计师:");
				contents.append(decorationOrderPO.getDesignerPO().getUserId());
				contents.append("回访提醒!");
				
				List<UserVO> users = userService.queryUserByDetpIdADuty(decorationOrderPO.getDesignerPO().getDept().getDeptId(), "设计部经理");
				message.setContents(contents.toString());
				if(users.size() > 0){
					message.setReceiver(new UserVO(users.get(0).getUserId()));
					messageService.sendMessage(message);
				}
			}
		}
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void addBackVisit(BackVisitVO backVisitVO) throws FLException{
		BackVisitPO backVisitPO = new BackVisitPO();
		
		DecorationOrderPO decorationOrderPO = decorationOrderDao.queryOrderByOrderId(backVisitVO.getOrderId());
		
		if(decorationOrderPO == null){
			throw new FLException(140013, "订单不存在");
		}

		BeanUtil.copyProperties(backVisitVO, backVisitPO);
		backVisitPO.setDecorationOrderPO(decorationOrderPO);
		
		UserPO userPO = new UserPO();
		userPO.setUserId(backVisitVO.getDesignerId());
		backVisitPO.setDesignerPO(userPO);
		
		backVisitDao.saveOrUpdate(backVisitPO);
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deleteBackVisitById(BackVisitVO orderDesignPicture){	
		backVisitDao.deleteById(orderDesignPicture.getAutoId());
	}

}
