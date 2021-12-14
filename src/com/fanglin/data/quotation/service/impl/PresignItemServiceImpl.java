package com.fanglin.data.quotation.service.impl;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.PresignItemPO;
import com.fanglin.data.quotation.dao.PresignItemDao;
import com.fanglin.data.quotation.service.PresignItemService;
import com.fanglin.data.quotation.vo.PresignItemVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("presignItemService")
@Transactional(readOnly = true)
public class PresignItemServiceImpl implements PresignItemService {

	@Autowired
	private PresignItemDao presignItemDao;

	@Override
	public void pagePresignItem(Paging paging, List<Filter> filters, PresignItemVO presignItemVO, List<Short> types) {

		List<PresignItemPO> presignItemPOs = presignItemDao.pagePresignItem(paging, filters, presignItemVO.getPpid(), presignItemVO.getStatus(), types);
		List<PresignItemVO> presignItemVOs = new ArrayList<PresignItemVO>();

		for (PresignItemPO presignItemPO : presignItemPOs) {

			presignItemVO = new PresignItemVO();

			BeanUtil.copyPropertie(presignItemPO, presignItemVO);

			presignItemVOs.add(presignItemVO);
		}

		paging.setData(presignItemVOs);
	}

	@Override
	public PresignItemVO queryPresignItemByPiid(PresignItemVO presignItemVO) throws FLException {

		PresignItemPO presignItemPO = presignItemDao.get(presignItemVO.getPiid());

		BeanUtil.copyPropertie(presignItemPO, presignItemVO);

		return presignItemVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addPresignItem(PresignItemVO presignItemVO) {

		PresignItemPO presignItemPO = new PresignItemPO();

		BeanUtil.copyProperties(presignItemVO, presignItemPO);

		presignItemDao.save(presignItemPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updatePresignItem(PresignItemVO presignItemVO) throws FLException, ParseException {

		PresignItemPO presignItemPO = presignItemDao.get(presignItemVO.getPiid());

		if (presignItemPO == null) {
			throw new FLException(130086, "预签项不存在");
		}

		if (presignItemPO.getStatus() == 0) {
			throw new FLException(130087, "预签项不可操作");
		}

		BeanUtil.copyProperties(presignItemVO, presignItemPO);

		presignItemDao.update(presignItemPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updatePresignItemForStatus(PresignItemVO presignItemVO) throws FLException {

		PresignItemPO presignItemPO = presignItemDao.get(presignItemVO.getPiid());

		if (presignItemPO == null) {
			throw new FLException(130086, "预签项不存在");
		}

		presignItemPO.setStatus(presignItemVO.getStatus());

		presignItemDao.update(presignItemPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deletePresignItem(PresignItemVO presignItemVO) {

		PresignItemPO presignItemPO = presignItemDao.get(presignItemVO.getPiid());

		presignItemDao.delete(presignItemPO);

		return 0;
	}

}
