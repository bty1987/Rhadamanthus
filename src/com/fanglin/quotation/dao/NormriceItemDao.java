package com.fanglin.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.quotation.po.NormriceItemBase;

/**
 * 定额工费明细 DAO。
 * 🔴 分表路由: normtion.index 决定物理表(normriceitem / normriceitem{index}), 全方法首参 index
 *   由 Service 层按 qid 解析(normtion 存在则取其 index, 否则 0), 传 0 即原表。漏传 index = 查错表。
 */
public interface NormriceItemDao extends Dao<NormriceItemBase> {

	public List<NormriceItemBase> queryNormriceItem(int index, long qid);

	public List<NormriceItemBase> queryNormriceItemByType(int index, long qid, short type);

	public NormriceItemBase queryNormriceItem(int index, long sid, long quoteId, long npid, short type);

	public NormriceItemBase getNormriceItem(int index, long npiid);

	public int countNormoodItem(int index, long qid, long cnid);

	public int amountNormriceItem(int index, long qid, long cnid);

	public int amountNormriceItemForSalary(int index, long qid, long cnid);

	public int disabledNormriceItem(int index, long qid);

	public int disabledNormriceItem(int index, long qid, short type);

	public int disabledNormriceItem(int index, long qid, long sid, short type);

	public int disabledNormriceItem(int index, long qid, long sid, long quoteId, short type);

	public int deleteNormriceItem(int index, long qid, short type);

	public int deleteNormriceItem(int index, long qid, short type, short status);

	public int deleteNormriceItem(int index, long qid, long sid, short type);

	// qid+主键双键: 路由后表内主键定位
	public int confirmNormriceItem(int index, long qid, long npiid, String confirmer);

	public int rejectNormriceItem(int index, long qid, long npiid);

}
