package com.fanglin.store.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.vo.Filter;
import com.fanglin.store.dao.MuserDao;
import com.fanglin.store.po.MuserPO;
import com.fanglin.store.service.MuserService;
import com.fanglin.store.vo.MuserVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;
import com.fanglin.utils.UUIDUtil;

@Service("muserService")
@Transactional(readOnly = true)
public class MuserServiceImpl implements MuserService {

	@Autowired
	private MuserDao muserDao;

	@Override
	public void pageMuser(Paging paging, List<Filter> filters) {

		List<MuserPO> muserPOs = muserDao.pageMuser(paging, filters);
		List<MuserVO> muserVOs = new ArrayList<MuserVO>();

		for (MuserPO muserPO : muserPOs) {

			MuserVO muserVO = new MuserVO();

			BeanUtil.copyProperties(muserPO, muserVO);

			muserVOs.add(muserVO);
		}

		paging.setData(muserVOs);
	}

	@Override
	public MuserVO queryMuserByUnionId(MuserVO muser) {

		MuserPO muserPO = muserDao.queryMuserByUnionId(muser.getUnionId());

		MuserVO muserVO = new MuserVO();

		BeanUtil.copyProperties(muserPO, muserVO);

		return muserVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int saveMuser(MuserVO muserVO) {

		MuserPO muserPO = muserDao.queryMuserByUnionId(muserVO.getUnionId());

		if (muserPO != null) {

			BeanUtil.copyProperties(muserVO, muserPO);

			muserDao.update(muserPO);

		} else {

			muserPO = new MuserPO();

			muserVO.setName(UUIDUtil.getUuid());

			BeanUtil.copyProperties(muserVO, muserPO);

			muserDao.save(muserPO);

			muserVO.setUid(muserPO.getUid());
			muserVO.setName(muserPO.getName());
		}

		return 0;
	}

}
