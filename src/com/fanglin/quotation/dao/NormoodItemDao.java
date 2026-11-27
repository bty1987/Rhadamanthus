package com.fanglin.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.quotation.po.NormoodItemBase;

/**
 * 定额材料明细 DAO。
 * 🔴 分表路由: normtion.index 决定物理表(normooditem / normooditem{index}), 全方法首参 index
 *   由 Service 层按 qid 解析, 传 0 即原表。漏传 index = 查错表。
 */
public interface NormoodItemDao extends Dao<NormoodItemBase> {

	public List<NormoodItemBase> queryNormoodItem(int index, long qid);

	public NormoodItemBase queryNormoodItem(int index, long sid, long quoteId, long ngid, short type);

	public NormoodItemBase getNormoodItem(int index, long ngiid);

	public long amountNormoodItem(int index, long qid, long nid);

	public int countNormoodItem(int index, long qid, long sid, short type);

	public int countNormoodItem(int index, long qid, long sid, long quoteld, short type);

	public int disableNormoodItem(int index, long qid);

	public int disableNormoodItem(int index, long qid, short type);

	public int disableNormoodItem(int index, long qid, long sid, short type);

	public int disableNormoodItem(int index, long qid, long sid, long quoteId, short type);

	public int deleteNormoodItem(int index, long qid, short type);

	public int deleteNormoodItem(int index, long qid, short type, short status);

	public int deleteNormoodItem(int index, long qid, long sid, short type);

	public int deleteNormoodItem(int index, long qid, long sid, long quoteId, short type);

}
