package com.fanglin.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.quotation.po.NormChangeRecordPO;
import com.fanglin.quotation.vo.NormChangeRecordVO;
import com.fanglin.utils.Paging;

public interface NormChangeRecordDao extends Dao<NormChangeRecordPO> {

	public List<NormChangeRecordPO> pageNormChangeRecord(Paging paging, NormChangeRecordVO condition);

}
