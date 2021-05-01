#include <vector>
#include <memory>
#include <stdio.h>

/*
https://blog.esciencecenter.nl/using-c-in-a-web-app-with-webassembly-efd78c08469

~/github/emsdk/upstream/emscripten/em++ \
  cc/choose.cc \
  -o dist/fiftyfour.wasm -O3 -s WASM=1

wasm2wat dist/fiftyfour.wasm -o src/fiftyfour.wat
*/

class Choose
{
public:
  Choose(
      const int *source, int source_count,
      int count) : source_(source), source_count_(source_count),
                   count_(count), position_(count), done_(false)
  {
    for (int i = 0; i < count; ++i)
    {
      position_[i] = i;
    }
  }

  // Populates arr with the next permuation of `source` and increments
  // the position.
  void Next(int *arr)
  {
    if (done_)
    {
      return;
    }
    int outIndex = 0;
    for (int i : position_)
    {
      arr[outIndex++] = source_[i];
    }
    Increment();
  }

  bool done()
  {
    return done_;
  }

private:
  void IncrementAt(int i)
  {
    if (i < 0)
    {
      done_ = true;
      return;
    }
    position_[i] = position_[i] + 1;
    if (position_[i] > source_count_ - (count_ - i))
    {
      IncrementAt(i - 1);
    }
    else
    {
      for (int j = i + 1; j < count_; ++j)
      {
        position_[j] = position_[j - 1] + 1;
      }
    }
  }

  void Increment()
  {
    IncrementAt(count_ - 1);
  }

  const int *source_;
  const int source_count_;
  const int count_;
  std::vector<int> position_;
  bool done_;
};

extern "C" __attribute__((used)) bool ChooseIsDone(Choose *choose)
{
  return choose->done();
}

extern "C" __attribute__((used)) void ChooseNext(Choose *choose, int *arr)
{
  choose->Next(arr);
}

extern "C" __attribute__((used)) void *_malloc(size_t size)
{
  return malloc(size);
}

extern "C" __attribute__((used)) Choose *MakeChoose(
    int *source, int source_count, int choose_count)
{
  return new Choose(source, source_count, choose_count);
}

extern "C" __attribute__((used)) int Speed(
    int source_count, int choose_count)
{
  int *source = (int *)malloc(source_count * 4);
  int *target = (int *)malloc(choose_count * 4);

  Choose c(source, source_count, choose_count);
  int i = 0;
  while (!c.done())
  {
    c.Next(target);
    ++i;
  }

  free(source);
  free(target);
  return i;
}

int main(int argc, char **argv)
{
}