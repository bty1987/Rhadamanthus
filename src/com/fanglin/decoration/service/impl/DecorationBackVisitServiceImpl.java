/**
 * @File Name		: DecorationBackVisitServiceImpl
 * @Package   	: com.fanglin.decoration.service.impl
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email			: bty1987@163.com
 * @Describing	:
 */

package com.fanglin.decoration.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.dao.DecorationBackVisitDao;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationBackVisitPO;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.service.DecorationBackVisitService;
import com.fanglin.decoration.vo.DecorationBackVisitVO;
import com.fanglin.information.service.MessageService;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("decorationBackVisitService")
@Transactional(readOnly = true)
public class DecorationBackVisitServiceImpl implements DecorationBackVisitService {

	@Autowired
	private DecorationBackVisitDao decorationBackVisitDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private MessageService messageService;

	@Override
	public void pageDecorationBackVisitByOrderId(Paging paging, List<Filter> filters, DecorationBackVisitVO backVisitVO) {

		List<DecorationBackVisitVO> backVisitVOs = new ArrayList<DecorationBackVisitVO>();
		List<DecorationBackVisitPO> backVisitPOs = decorationBackVisitDao.pageDecorationBackVisitByOrderId(paging, filters, backVisitVO.getOrderId());

		for (DecorationBackVisitPO backVisitPO : backVisitPOs) {
			backVisitVO = new DecorationBackVisitVO();

			BeanUtil.copyProperties(backVisitPO, backVisitVO, Arrays.asList("decoration", "sender"));

			UserPO sender = backVisitPO.getSender();

			backVisitVO.setOrderId(backVisitPO.getDecoration().getOrderId());
			backVisitVO.setSender(sender.getCurrentName());
			backVisitVO.setSenderId(sender.getUserId());
			backVisitVO.setSenderPhoto(sender.getUserPhoto());

			backVisitVOs.add(backVisitVO);
		}

		paging.setData(backVisitVOs);
	}

	@Override
	public List<DecorationBackVisitVO> queryDecorationBackVisitByOrderId(DecorationBackVisitVO backVisitVO) {

		List<DecorationBackVisitPO> backVisitPOs = decorationBackVisitDao.queryDecorationBackVisitByOrderId(backVisitVO.getOrderId());
		List<DecorationBackVisitVO> backVisitVOs = new ArrayList<DecorationBackVisitVO>();

		for (DecorationBackVisitPO backVisitPO : backVisitPOs) {
			backVisitVO = new DecorationBackVisitVO();

			BeanUtil.copyProperties(backVisitPO, backVisitVO, Arrays.asList("decoration", "sender"));

			UserPO sender = backVisitPO.getSender();

			backVisitVO.setOrderId(backVisitPO.getDecoration().getOrderId());
			backVisitVO.setSender(sender.getCurrentName());
			backVisitVO.setSenderId(sender.getUserId());
			backVisitVO.setSenderPhoto(sender.getUserPhoto());

			backVisitVOs.add(backVisitVO);
		}

		return backVisitVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addDecorationBackVisit(DecorationBackVisitVO backVisitVO, String userId, int company) throws FLException {

		String orderId = backVisitVO.getOrderId();

		DecorationBackVisitPO backVisitPO = new DecorationBackVisitPO();

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) {
			throw new FLException(140013, "装修单不存在");
		}

		UserPO userPO = userDao.queryUserByUserId(userId);

		if (userPO == null) {
			throw new FLException(220005, "员工不存在");
		}

		BeanUtil.copyProperties(backVisitVO, backVisitPO, Arrays.asList("decoration", "sender"));

		backVisitPO.setDecoration(decorationPO);
		backVisitPO.setSender(userPO);
		backVisitPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));

		StringBuffer receiverIds = new StringBuffer();

		if (backVisitVO.getReceivers() != null && backVisitVO.getReceivers().size() > 0) {

			List<String> receivers = backVisitVO.getReceivers();

			for (String receiverId : receivers) {
				messageService.sendMessage(receiverId.trim(), userPO.getUserId(), backVisitVO.getContent(), (short) 5, company);
				receiverIds.append(String.format("%s,", receiverId));
			}
		}

		backVisitPO.setReceiverIds(receiverIds.toString());

		decorationBackVisitDao.save(backVisitPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void deleteDecorationBackVisitById(DecorationBackVisitVO orderDesignPicture) {
		decorationBackVisitDao.deleteById(orderDesignPicture.getBvId());
	}

}
