package com.fanglin.data.quotation.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.vo.ConstructionNodeVO;
import com.fanglin.data.po.CormtimePO;
import com.fanglin.data.po.ConstructionNodePO;
import com.fanglin.data.quotation.dao.CormtimeDao;
import com.fanglin.quotation.dao.NormChangeRecordDao;
import com.fanglin.quotation.po.NormChangeRecordPO;
import com.fanglin.data.quotation.service.CormtimeService;
import com.fanglin.data.quotation.vo.CormtimeVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("cormtimeService")
@Transactional(readOnly = true)
public class CormtimeServiceImpl implements CormtimeService {

	@Autowired
	public CormtimeDao cormtimeDao;

	@Autowired
	private NormChangeRecordDao normChangeRecordDao;

	@Override
	public void pageCormtime(Paging paging, List<Filter> filters) {

		List<CormtimePO> cormtimePOs = cormtimeDao.pageCormtime(paging, filters);
		List<CormtimeVO> cormtimeVOs = new ArrayList<CormtimeVO>();

		for (CormtimePO cormtimePO : cormtimePOs) {

			CormtimeVO cormtimeVO = new CormtimeVO(new ConstructionNodeVO());

			BeanUtil.copyProperties(cormtimePO, cormtimeVO, Arrays.asList("constructionNode"));
			BeanUtil.copyProperties(cormtimePO.getConstructionNode(), cormtimeVO.getConstructionNode(), Arrays.asList("startSurvey", "endSurvey"));

			cormtimeVOs.add(cormtimeVO);
		}

		paging.setData(cormtimeVOs);

	}

	@Override
	public List<CormtimeVO> queryCormtimeByQfid(Long qfid) {

		List<CormtimePO> cormtimePOs = cormtimeDao.queryCormtimeByQfid(qfid);
		List<CormtimeVO> cormtimeVOs = new ArrayList<CormtimeVO>();

		for (CormtimePO cormtimePO : cormtimePOs) {

			CormtimeVO cormtimeVO = new CormtimeVO(new ConstructionNodeVO());

			BeanUtil.copyProperties(cormtimePO, cormtimeVO, Arrays.asList("constructionNode"));
			BeanUtil.copyProperties(cormtimePO.getConstructionNode(), cormtimeVO.getConstructionNode(), Arrays.asList("startSurvey", "endSurvey"));

			cormtimeVOs.add(cormtimeVO);
		}

		return cormtimeVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addCormtime(CormtimeVO cormtimeVO, String userId) {

		CormtimePO cormtimePO = new CormtimePO(new ConstructionNodePO());

		BeanUtil.copyPropertie(cormtimeVO, cormtimePO, Arrays.asList("constructionNode"));
		BeanUtil.copyProperties(cormtimeVO.getConstructionNode(), cormtimePO.getConstructionNode(), Arrays.asList("startSurvey", "endSurvey"));

		cormtimePO.setStatus(CormtimePO.STATUS_VALID_STR);

		cormtimeDao.save(cormtimePO);

		// 变更记录: 定额工时镜像添加(按规格qfid关联)
		normChangeRecordDao.save(new NormChangeRecordPO().init(NormChangeRecordPO.TYPE_QUOTATIONITEM_QFID_INT, NormChangeRecordPO.CHANGETYPE_ADD_INT, userId)
				.refId(cormtimeVO.getQfid()).refNo(cormtimePO.getConstructionNode() != null ? cormtimePO.getConstructionNode().getName() : "定额工时镜像")
				.after(String.format("定额工时镜像: qfid=%d, 节点: %s, 工时天数: %s", cormtimeVO.getQfid(), cormtimePO.getConstructionNode() != null ? cormtimePO.getConstructionNode().getName() : "---", cormtimePO.getWorkdays())));

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteCormtime(CormtimeVO cormtimeVO, String userId) {

		// 变更记录: 定额工时镜像删除
		normChangeRecordDao.save(new NormChangeRecordPO().init(NormChangeRecordPO.TYPE_QUOTATIONITEM_QFID_INT, NormChangeRecordPO.CHANGETYPE_DELETE_INT, userId)
				.refId(cormtimeVO.getCtid()).refNo("定额工时镜像")
				.before(String.format("定额工时镜像行: ctid=%d", cormtimeVO.getCtid())));

		cormtimeDao.deleteById(cormtimeVO.getCtid());

		return 0;
	}

}
