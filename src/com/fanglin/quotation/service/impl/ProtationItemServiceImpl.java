/**
 * @File Name		: ProtationItemServiceImpl.java
 * @Package   	: com.fanglin.quotation.service.impl
 * @Version		: 1.0
 * @Date			: 2021-9-19
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.quotation.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.po.PresignItemPO;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.quotation.dao.ProtationDao;
import com.fanglin.quotation.dao.ProtationItemDao;
import com.fanglin.quotation.po.ProtationItemPO;
import com.fanglin.quotation.po.ProtationPO;
import com.fanglin.quotation.service.ProtationItemService;
import com.fanglin.quotation.vo.ProtationItemVO;
import com.fanglin.quotation.vo.ProtationVO;
import com.fanglin.utils.BeanUtil;

@Service("protationItemService")
@Transactional(readOnly = true)
public class ProtationItemServiceImpl implements ProtationItemService {

	@Autowired
	private ProtationDao protationDao;

	@Autowired
	private ProtationItemDao protationItemDao;

	@Autowired
	private DecorationDao decorationDao;

	@Override
	public List<ProtationItemVO> queryProtationItemByPid(ProtationItemVO protationItemVO) {

		List<ProtationItemPO> protationItemPOs = protationItemDao.queryProtationItem(protationItemVO.getPid());
		List<ProtationItemVO> protationItemVOs = new ArrayList<ProtationItemVO>();

		for (ProtationItemPO protationItemPO : protationItemPOs) {

			protationItemVO = new ProtationItemVO();

			BeanUtil.copyPropertie(protationItemPO, protationItemVO, Arrays.asList("item", "content"));

			if (protationItemPO.getItem() != null) {
				protationItemVO.setPpiid(protationItemPO.getItem().getPiid());
				protationItemVO.setContent(protationItemPO.getItem().getContent());
			} else {
				protationItemVO.setContent("");
			}

			protationItemVOs.add(protationItemVO);
		}

		return protationItemVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public ProtationItemVO updateProtationItem(ProtationVO protationVO, ProtationItemVO protationItemVO) throws FLException {

		ProtationPO protationPO = checkProtation(protationVO.getPid());

		DecorationPO decorationPO = checkDecoration(protationPO.getOrderId());

		protationPO.convert(protationVO);

		Long piid = protationItemVO.getPiid();

		if (piid != null) {

			ProtationItemPO protationItemPO = protationItemDao.get(piid);

			if (protationItemPO == null) {
				throw new FLException(200052, "预签项不存在");
			}

			protationItemPO.setNum(protationItemVO.getNum());

			protationItemDao.update(protationItemPO);
		} else {

			ProtationItemPO protationItemPO = new ProtationItemPO();

			BeanUtil.copyPropertie(protationItemVO, protationItemPO, Arrays.asList("item", "content"));

			protationItemPO.setPid(protationPO.getPid());

			if (protationItemVO.getPpiid() != null) protationItemPO.setItem(new PresignItemPO(protationItemVO.getPpiid()));

			protationItemDao.save(protationItemPO);

			protationItemVO.setPiid(protationItemPO.getPiid());
		}

		if (protationPO.getDefaults() == ProtationPO.DEFAULT_DEFAULT_INT) {

			decorationPO.setPrecontractPrice(protationPO.getTotalPrice());

			decorationDao.update(decorationPO);
		}

		protationDao.update(protationPO);

		return null;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteProtationItem(ProtationVO protationVO, ProtationItemVO protationItemVO) throws FLException {

		ProtationPO protationPO = checkProtation(protationVO.getPid());

		DecorationPO decorationPO = checkDecoration(protationPO.getOrderId());

		protationPO.convert(protationVO);

		ProtationItemPO protationItemPO = protationItemDao.get(protationItemVO.getPiid());

		if (protationItemPO == null) {
			throw new FLException(200052, "预签项不存在");
		}

		protationItemDao.delete(protationItemPO);

		if (protationPO.getDefaults() == ProtationPO.DEFAULT_DEFAULT_INT) {

			decorationPO.setPrecontractPrice(protationPO.getTotalPrice());

			decorationDao.update(decorationPO);
		}

		protationDao.update(protationPO);

		return 0;
	}

	public DecorationPO checkDecoration(String orderId) throws FLException {

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		List<Short> status = Arrays.asList(new Short[] { DecorationPO.STATUS_INIT_INT, DecorationPO.STATUS_DEPOSIT_INT });

		if (decorationPO == null) {
			throw new FLException(140013, "装修单不存在");
		}

		if (!status.contains(decorationPO.getStatus())) {
			throw new FLException(200047, "预签状态不可操作");
		}

		return decorationPO;
	}

	public ProtationPO checkProtation(long pid) throws FLException {

		ProtationPO protationPO = protationDao.get(pid);

		if (protationPO == null) {
			throw new FLException(200046, "预签不存在");
		}

		if (protationPO.getStatus() != ProtationPO.STATUS_INIT_INT) {
			throw new FLException(200047, "预签状态不可操作");
		}

		return protationPO;
	}

}
