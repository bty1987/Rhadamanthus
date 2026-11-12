package com.fanglin.data.quotation.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.material.dao.NoodsDao;
import com.fanglin.data.material.vo.NoodsVO;
import com.fanglin.data.po.CormoodPO;
import com.fanglin.data.po.NoodsPO;
import com.fanglin.data.quotation.dao.CormoodDao;
import com.fanglin.quotation.dao.NormChangeRecordDao;
import com.fanglin.quotation.po.NormChangeRecordPO;
import com.fanglin.data.quotation.service.CormoodService;
import com.fanglin.data.quotation.vo.CormoodVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("cormoodService")
@Transactional(readOnly = true)
public class CormoodServiceImpl implements CormoodService {

	@Autowired
	public CormoodDao cormoodDao;

	@Autowired
	public NoodsDao noodsDao;

	@Autowired
	private NormChangeRecordDao normChangeRecordDao;

	@Override
	public void pageCormood(Paging paging, List<Filter> filters) {

		List<CormoodPO> cormoodPOs = cormoodDao.pageCormood(paging, filters);
		List<CormoodVO> cormoodVOs = new ArrayList<CormoodVO>();

		for (CormoodPO cormoodPO : cormoodPOs) {

			CormoodVO cormoodVO = new CormoodVO(new NoodsVO());

			BeanUtil.copyProperties(cormoodPO, cormoodVO, Arrays.asList("noods"));

			if (cormoodPO.getNoods() != null) BeanUtil.copyPropertie(cormoodPO.getNoods(), cormoodVO.getNoods());

			cormoodVOs.add(cormoodVO);
		}

		paging.setData(cormoodVOs);

	}

	@Override
	public List<CormoodVO> queryCormoodByQfid(Long qfid) {

		List<CormoodPO> cormoodPOs = cormoodDao.queryCormoodByQfid(qfid);
		List<CormoodVO> cormoodVOs = new ArrayList<CormoodVO>();

		for (CormoodPO cormoodPO : cormoodPOs) {

			CormoodVO cormoodVO = new CormoodVO(new NoodsVO());

			BeanUtil.copyProperties(cormoodPO, cormoodVO, Arrays.asList("noods"));

			if (cormoodPO.getNoods() != null) BeanUtil.copyPropertie(cormoodPO.getNoods(), cormoodVO.getNoods());

			cormoodVOs.add(cormoodVO);
		}

		return cormoodVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addCormood(CormoodVO cormoodVO, String userId) throws FLException {

		CormoodPO cormoodPO = new CormoodPO();

		BeanUtil.copyPropertie(cormoodVO, cormoodPO, Arrays.asList("noods"));

		NoodsPO noodsPO = noodsDao.get(cormoodVO.getNoods().getNid());

		if (noodsPO == null) {
			throw new FLException(130118, "定材不存在");
		}

		cormoodPO.setName(noodsPO.getName());
		cormoodPO.setNoods(noodsPO);

		cormoodPO.setStatus(CormoodPO.STATUS_VALID_STR);

		cormoodDao.save(cormoodPO);

		// 变更记录: 定额材料镜像添加(按规格qfid关联)
		normChangeRecordDao.save(new NormChangeRecordPO().init(NormChangeRecordPO.TYPE_QUOTATIONITEM_QFID_INT, NormChangeRecordPO.CHANGETYPE_ADD_INT, userId)
				.refId(cormoodPO.getQfid()).refNo(noodsPO.getName())
				.after(String.format("定额材料镜像: qfid=%d, 定材: %s", cormoodPO.getQfid(), noodsPO.getName())));

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteCormood(CormoodVO cormoodVO, String userId) {

		// 变更记录: 定额材料镜像删除(deleteById 前无行可读, 记目标id)
		normChangeRecordDao.save(new NormChangeRecordPO().init(NormChangeRecordPO.TYPE_QUOTATIONITEM_QFID_INT, NormChangeRecordPO.CHANGETYPE_DELETE_INT, userId)
				.refId(cormoodVO.getCgid()).refNo("定额材料镜像")
				.before(String.format("定额材料镜像行: cgid=%d", cormoodVO.getCgid())));

		cormoodDao.deleteById(cormoodVO.getCgid());

		return 0;
	}

}
