package com.fanglin.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.quotation.po.NormriceItemPO;

public interface NormriceItemDao extends Dao<NormriceItemPO> {

	public List<NormriceItemPO> queryNormriceItem(long qid);

	public List<NormriceItemPO> queryNormriceItemByType(long qid, short type);

	public NormriceItemPO queryNormriceItem(long sid, long quoteId, long npid, short type);

	public int countNormoodItem(long qid, long cnid);

	public int amountNormriceItem(long qid, long cnid);

	public int amountNormriceItemForSalary(long qid, long cnid);

	public int disabledNormriceItem(long qid);

	public int disabledNormriceItem(long qid, short type);

	public int disabledNormriceItem(long qid, long sid, short type);

	public int disabledNormriceItem(long qid, long sid, long quoteId, short type);

	public int deleteNormriceItem(long qid, short type);

	public int deleteNormriceItem(long qid, short type, short status);

	public int deleteNormriceItem(long qid, long sid, short type);

	// qid+主键双键: qid RANGE 分区裁剪(分区表落地后按主键裸查=全分区扫描)
	public int confirmNormriceItem(long qid, long npiid, String confirmer);

	public int rejectNormriceItem(long qid, long npiid);

}
